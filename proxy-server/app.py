from flask import Flask, jsonify
from flask_cors import CORS
import requests
import numpy as np
import pandas as pd
from scipy.stats import kurtosis, skew
from arch import arch_model
from xgboost import XGBRegressor
import matplotlib.pyplot as plt
import io, base64
import datetime
import matplotlib
from matplotlib.gridspec import GridSpec
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Rectangle
import os
import time

matplotlib.use("Agg")

app = Flask(__name__)
CORS(app)

@app.route('/predict/<coin_id>', methods=['GET'])
def predict_future_trend(coin_id):
    days = 365
    future_days = 10
    currency = "usd"

    max_retries = 5
    retry_delay_seconds = 2
    resp = None

    for attempt in range(max_retries):
        url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency={currency}&days={days}"
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                break
            elif resp.status_code == 429:
                print(f"Flask: CoinGecko rate limit hit for {coin_id} (attempt {attempt+1}/{max_retries}). Retrying in {retry_delay_seconds} seconds...")
                time.sleep(retry_delay_seconds)
                retry_delay_seconds *= 2
            else:
                print(f"Flask: Failed to fetch historical data for {coin_id}. Status: {resp.status_code}. Response: {resp.text}")
                return jsonify({"error": f"Failed to fetch historical data from CoinGecko. Status: {resp.status_code}"}), 400
        except requests.exceptions.RequestException as e:
            print(f"Flask: RequestException fetching data for {coin_id} (attempt {attempt+1}/{max_retries}): {e}. Retrying in {retry_delay_seconds} seconds...")
            time.sleep(retry_delay_seconds)
            retry_delay_seconds *= 2

    if resp is None or resp.status_code != 200:
        print(f"Flask: Failed to fetch historical data for {coin_id} after {max_retries} attempts.")
        return jsonify({"error": "Failed to fetch historical data from CoinGecko after multiple retries due to rate limit or network issue."}), 400

    data_json = resp.json()
    prices_list = data_json.get('prices', [])
    volumes_list = data_json.get('total_volumes', [])
    if not prices_list or not volumes_list:
        return jsonify({"error": "No price/volume data available from CoinGecko."}), 400

    df = pd.DataFrame(prices_list, columns=["timestamp", "price"])
    df["volume"] = [v[1] for v in volumes_list]
    df["timestamp"] = df["timestamp"] / 1000.0
    df["date"] = pd.to_datetime(df["timestamp"], unit="s")
    df.sort_values("date", inplace=True)
    df["return"] = df["price"].pct_change()
    df.dropna(inplace=True)

    returns = df["return"]
    mean_return_daily = returns.mean()
    std_return_daily = returns.std()
    negative_returns = returns[returns < 0]
    downside_std = negative_returns.std()
    sharpe_ratio = (mean_return_daily * 365) / (std_return_daily * np.sqrt(365)) if std_return_daily != 0 else 0
    sortino_ratio = (mean_return_daily * 365) / (downside_std * np.sqrt(365)) if downside_std != 0 else 0
    daily_kurtosis = kurtosis(returns, fisher=True)
    daily_skew = skew(returns)

    if daily_kurtosis < 3:
        kurt_class = "Platykurtic"
        kurt_color = "green"
    elif abs(daily_kurtosis - 3) < 0.5:
        kurt_class = "Mesokurtic"
        kurt_color = "yellow"
    else:
        kurt_class = "Leptokurtic"
        kurt_color = "red"

    X = np.arange(len(df)).reshape(-1, 1)
    y = df["price"].values
    xgb_model = XGBRegressor(n_estimators=150, learning_rate=0.1, random_state=42)
    xgb_model.fit(X, y)

    extended_range = np.arange(len(df), len(df) + future_days + 60).reshape(-1, 1)
    xgb_preds_extended = xgb_model.predict(extended_range)

    future_index = np.arange(len(df), len(df) + future_days).reshape(-1, 1)
    xgb_preds = xgb_model.predict(future_index)

    scaled_returns = returns * 100.0
    garch = arch_model(scaled_returns, vol='Garch', p=1, q=1, dist='normal')
    res = garch.fit(disp='off')
    forecast = res.forecast(horizon=future_days)
    forecasted_variances = forecast.variance.iloc[-1].values / (100.0 ** 2)
    forecasted_std = np.sqrt(forecasted_variances)

    last_date = df["date"].iloc[-1]
    forecast_dates = [last_date + datetime.timedelta(days=i+1) for i in range(future_days)]

    fig = plt.figure(figsize=(20, 12))
    gs = GridSpec(2, 3, figure=fig, height_ratios=[1, 1])

    ax1 = fig.add_subplot(gs[0, 0])
    ax1.plot(df["date"], df["price"], label="Historical Price", color="blue", linewidth=1.8)
    extended_dates_list = [last_date + datetime.timedelta(days=i) for i in range(len(xgb_preds_extended))]
    ax1.plot(extended_dates_list, xgb_preds_extended, label="XGBoost Forecast", color="orange",
                    linewidth=2, marker='o', markersize=4)
    ax1.set_title("Historical Price + Extended XGBoost Forecast", fontsize=14)
    ax1.set_xlabel("Date", fontsize=12)
    ax1.set_ylabel("Price (USD)", fontsize=12)
    ax1.legend(fontsize=10)
    ax1.grid(alpha=0.5)

    ax2 = fig.add_subplot(gs[0, 1])
    ax2.bar(range(1, future_days+1), forecasted_std, color="purple", alpha=0.7, edgecolor="black")
    ax2.set_title("GARCH Volatility (Next 10 Days)", fontsize=14)
    ax2.set_xlabel("Forecast Day", fontsize=12)
    ax2.set_ylabel("Std Dev", fontsize=12)
    ax2.grid(alpha=0.5)

    ax3 = fig.add_subplot(gs[0, 2])
    ax3.axis("off")

    ax3.set_xlim(0, 1)
    ax3.set_ylim(0, 1)

    gradient = np.linspace(0, 1, 100).reshape(-1, 1)
    gradient = np.repeat(gradient, 100, axis=1)
    colors = [(0.8, 0.95, 0.8), (0.6, 0.9, 0.6)]
    cmap = LinearSegmentedColormap.from_list("green_gradient", colors, N=100)
    ax3.imshow(gradient, cmap=cmap, aspect='auto', extent=[0, 1, 0, 1], alpha=0.8)

    border = Rectangle((0.01, 0.01), 0.98, 0.98, fill=False, edgecolor='darkgreen', linewidth=2, alpha=0.7)
    ax3.add_patch(border)

    corner_size = 0.05
    for x, y in [(0.01, 0.01), (0.01, 0.94), (0.94, 0.01), (0.94, 0.94)]:
        ax3.add_patch(Rectangle((x, y), corner_size, corner_size, facecolor='darkgreen', alpha=0.3))

    ax3.add_patch(Rectangle((0.05, 0.15), 0.9, 0.7, facecolor='white', alpha=0.5))

    ax3.text(0.5, 0.88, "Risk Analysis Implications", ha="center", va="center",
                        fontsize=16, fontweight='bold', color="darkgreen")

    implication_lines = [
        "• High kurtosis means higher",
        "probability of extreme returns.",
        "Such returns imply higher risk.",

        "• Leptokurtic distributions suggest",
        "fat tails and increased risk.",

        "• Mesokurtic values are moderate.",
        "Platykurtic means fewer extremes."
    ]

    start_y = 0.78
    line_spacing = 0.08
    for i, line in enumerate(implication_lines):
        ax3.text(0.08, start_y - i * line_spacing, line,
                        ha="left", va="top", fontsize=12.5, color="black", family='sans-serif')

    ax3.set_title("Investment Risk Analysis", fontsize=14, pad=5, color='darkgreen')

    ax4 = fig.add_subplot(gs[1, 0])

    gauge_min, gauge_max = 0, 10
    theta = np.linspace(0.25 * np.pi, 0.75 * np.pi, 100)

    r_inner, r_outer = 0.6, 1.0
    for i, color in enumerate(['green', 'yellow', 'red']):
        mask = np.logical_and(
            theta >= 0.25 * np.pi + i * (0.5 * np.pi / 3),
            theta <= 0.25 * np.pi + (i + 1) * (0.5 * np.pi / 3)
        )
        theta_section = theta[mask]
        ax4.fill_between(
            np.append(np.append([0], r_outer * np.cos(theta_section)), [0]),
            np.append(np.append([0], r_outer * np.sin(theta_section)), [0]),
            np.append(np.append([0], r_inner * np.sin(theta_section)), [0]),
            color=color, alpha=0.7
        )

    ax4.text(0, 0.3, "Low Risk", ha='center', va='center', fontsize=12, color='green', fontweight='bold')
    ax4.text(-0.5, 0.6, "Medium Risk", ha='center', va='center', fontsize=12, color='black', fontweight='bold')
    ax4.text(0.5, 0.6, "High Risk", ha='center', va='center', fontsize=12, color='red', fontweight='bold')

    needle_theta = 0.25 * np.pi + min(daily_kurtosis / gauge_max, 1) * 0.5 * np.pi
    ax4.plot([0, 0.8 * np.cos(needle_theta)], [0, 0.8 * np.sin(needle_theta)], 'k-', lw=3)
    ax4.add_patch(plt.Circle((0, 0), 0.05, color='black'))

    ax4.text(0, -0.1, f"Kurtosis: {daily_kurtosis:.2f}", ha='center', va='center', fontsize=14)
    ax4.text(0, -0.25, f"Classification: {kurt_class}", ha='center', va='center',
                        fontsize=14, color=kurt_color, fontweight='bold')
    ax4.text(0, -0.4, "Values > 3 indicate fat tails\nand higher risk of extreme events",
                        ha='center', va='center', fontsize=12)

    ax4.set_xlim(-1.2, 1.2)
    ax4.set_ylim(-0.5, 1.2)
    ax4.axis('off')
    ax4.set_title("Kurtosis Risk Gauge", fontsize=14, pad=15)

    ax5 = fig.add_subplot(gs[1, 1])
    hb = ax5.hexbin(np.arange(len(returns)), returns, gridsize=20, cmap="Blues", mincnt=1)
    ax5.set_title("Daily Returns Hexbin", fontsize=14)
    ax5.set_xlabel("Observation Index", fontsize=12)
    ax5.set_ylabel("Daily Return", fontsize=12)
    cbar = fig.colorbar(hb, ax=ax5)
    cbar.set_label("Count", fontsize=12)
    ax5.grid(alpha=0.4)

    ax6 = fig.add_subplot(gs[1, 2])
    df_30 = df.iloc[-30:].copy()
    bubble_size = (df_30["price"] / df_30["price"].mean()) * 200
    sc = ax6.scatter(df_30["return"], df_30["volume"], s=bubble_size,
                            alpha=0.6, c=df_30["price"], cmap="viridis", edgecolor="black")
    ax6.set_title("Returns vs. Volume (Last 30 Days)", fontsize=14)
    ax6.set_xlabel("Daily Return", fontsize=12)
    ax6.set_ylabel("Volume", fontsize=12)
    cbar2 = fig.colorbar(sc, ax=ax6)
    cbar2.set_label("Price (USD)", fontsize=12, rotation=270, labelpad=15)
    ax6.grid(alpha=0.4)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    buf.seek(0)
    base64_img = base64.b64encode(buf.read()).decode("utf-8")
    plt.close()

    return jsonify({
        "coin_id": coin_id,
        "predictions_xgb": xgb_preds.tolist(),
        "forecasted_volatility": forecasted_std.tolist(),
        "kurtosis": daily_kurtosis,
        "skew": daily_skew,
        "sharpe_ratio": sharpe_ratio,
        "sortino_ratio": sortino_ratio,
        "kurtosis_classification": kurt_class,
        "ml_plot": base64_img
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)