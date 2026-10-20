#!/usr/bin/env python3
"""
计算投资组合在不同观察频率下的赚钱概率、亏损次数、信噪比等。
前提：年化收益 μ=15%，年化波动率 σ=10%，夏普比率 SR=1.5
公式：P(收益>0) = Φ(SR × √t)，t 为观察周期（单位：年）

用法：python3 calc_observation_freq.py
可修改 MU 和 SIGMA 来测试不同组合。
"""

import math

def phi(x):
    """标准正态分布 CDF，使用 Python 内置 math.erfc，精度接近机器精度"""
    return 0.5 * math.erfc(-x / math.sqrt(2))

MU = 0.15       # 年化收益率
SIGMA = 0.10    # 年化波动率
SR = MU / SIGMA # 夏普比率 = 1.5

# 观察周期定义（名称, t 以年为单位, 每年观察次数）
# 使用日历时间：365 天/年, 24 小时/天
periods = [
    ("10 年",    10,        0.1),
    ("5 年",     5,         0.2),
    ("3 年",     3,         1/3),
    ("2 年",     2,         0.5),
    ("1 年",     1,         1),
    ("1 季度",   0.25,      4),
    ("1 个月",   1/12,      12),
    ("1 周",     1/52,      52),
    ("1 天",     1/365,     365),
    ("1 小时",   1/8760,    8760),
    ("1 分钟",   1/525600,  525600),
    ("1 秒",     1/31536000, 31536000),
]

results = []
for name, t, n_per_year in periods:
    expected_return = MU * t
    volatility = SIGMA * math.sqrt(t)
    snr = expected_return / volatility
    p_gain = phi(snr)
    p_loss = 1 - p_gain
    loss_per_year = n_per_year * p_loss

    results.append({
        "name": name,
        "t": t,
        "n_per_year": n_per_year,
        "expected_return": expected_return,
        "volatility": volatility,
        "snr": snr,
        "p_gain": p_gain,
        "p_loss": p_loss,
        "loss_per_year": loss_per_year,
    })

# ── 打印验证 ──
print(f"投资组合参数：μ={MU:.0%}  σ={SIGMA:.0%}  SR={SR:.1f}\n")
print(f"{'观察频率':^10} {'赚钱概率':>10} {'亏钱概率':>10} {'信噪比':>8} {'年亏损次数':>14}")
print("-" * 60)
for r in results:
    loss = r["loss_per_year"]
    if loss < 0.01:
        loss_str = "≈0"
    elif loss >= 1_000_000:
        loss_str = f"≈{loss/10000:,.0f}万"
    elif loss >= 1000:
        loss_str = f"≈{loss:,.0f}"
    elif loss < 1:
        loss_str = f"{loss:.2f}"
    else:
        loss_str = f"≈{loss:.0f}"
    print(f"{r['name']:^10} {r['p_gain']:>10.4%} {r['p_loss']:>10.4%} {r['snr']:>8.4f} {loss_str:>14}")

# ── 情绪净值（损失厌恶 ×2）──
print(f"\n{'观察频率':^10} {'赚次':>8} {'亏次':>8} {'快乐':>10} {'痛苦×2':>10} {'净情绪':>10}")
print("-" * 60)
for r in results:
    n = r["n_per_year"]
    if n < 1:
        continue
    wins = n * r["p_gain"]
    losses = n * r["p_loss"]
    net = wins - losses * 2
    print(f"{r['name']:^10} {wins:>8.1f} {losses:>8.1f} {wins:>+10.1f} {losses*2:>-10.1f} {net:>+10.1f}")
