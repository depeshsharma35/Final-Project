import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANS, PLAN_ORDER, COMPARISON_FEATURES, formatDate } from '../../data/plans';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import PageLayout from '../ui/PageLayout';

const INITIAL_TXN = [
  { id: 'txn_001', plan: 'gold', amount: 499, date: new Date(Date.now() - 30 * 86400000).toISOString(), status: 'success', txnId: 'PAY_XJK8382' },
  { id: 'txn_002', plan: 'silver', amount: 249, date: new Date(Date.now() - 62 * 86400000).toISOString(), status: 'success', txnId: 'PAY_DLQ7264' },
];

const PLAN_ACCENT = {
  elite:  { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'ring-amber-500', icon: 'fa-crown' },
  pro:    { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', ring: 'ring-violet-400', icon: 'fa-star' },
  bronze: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', ring: 'ring-orange-400', icon: 'fa-medal' },
  free:   { text: 'text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800', border: 'border-zinc-200 dark:border-zinc-700', ring: 'ring-zinc-400', icon: 'fa-lock-open' },
};

export default function PlansView() {
  const { state, setPlan } = useApp();
  const { showToast } = useToast();
  const [showHistory, setShowHistory] = useState(false);
  const [txns, setTxns] = useState(INITIAL_TXN);
  const [loading, setLoading] = useState(false);
  const currentPlan = state.currentPlan;

  const handleUpgrade = (key) => {
    if (key === currentPlan) { showToast('This is your current plan', 'info'); return; }
    if (key === 'free') { setPlan('free'); showToast('Switched to Free plan', 'info'); return; }
    const plan = PLANS[key]; if (!plan) return;
    setLoading(true);
    setTimeout(() => {
      const pid = 'PAY_' + Math.random().toString(36).slice(2, 10).toUpperCase();
      setPlan(key);
      setTxns(prev => [{ id: 'txn_' + Date.now(), plan: key, amount: plan.price, date: new Date().toISOString(), status: 'success', txnId: pid }, ...prev]);
      showToast(`🎉 Upgraded to ${plan.name} Plan!`, 'success', 5000);
      setLoading(false);
    }, 2000);
  };

  const renderVal = (val) => {
    if (val === true) return <i className="fa-solid fa-check text-green-500" />;
    if (val === false) return <i className="fa-solid fa-xmark text-zinc-300 dark:text-zinc-600" />;
    return <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{val}</span>;
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="text-center mb-12 max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Unlock the Full<br /><span className="text-amber-500">Streaming Experience</span>
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed">
          Upgrade for premium content, unlimited downloads, and ad-free HD viewing.
        </p>
      </div>

      {/* Plan cards */}
      <div id="pricing-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {PLAN_ORDER.map(key => {
          const plan = PLANS[key];
          const isCurrent = key === currentPlan;
          const isElite = key === 'elite';
          const ac = PLAN_ACCENT[key] || PLAN_ACCENT.free;

          return (
            <div key={key} id={`plan-card-${key}`}
              className={`relative bg-white dark:bg-zinc-900 rounded-2xl border-2 p-6 flex flex-col transition-all duration-200 ${
                isCurrent ? `${ac.border} ring-2 ${ac.ring}/30` : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              } ${isElite && !isCurrent ? 'ring-2 ring-amber-500/20' : ''}`}>

              {/* Badges */}
              {isElite && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-[11px] font-bold rounded-full">Most Popular</span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full">Current Plan</span>
              )}

              <div className="flex items-center gap-2.5 mb-2">
                <i className={`fa-solid ${ac.icon} ${ac.text} text-xl`} />
                <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{plan.name}</span>
              </div>

              <div className={`text-3xl font-bold ${ac.text} mb-0.5`}>{plan.priceLabel}</div>
              <div className="text-xs text-zinc-400 mb-5">{plan.period}</div>

              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <i className={`fa-solid ${f.included ? 'fa-check text-green-500' : 'fa-xmark text-zinc-300 dark:text-zinc-600'} text-xs shrink-0`} />
                    <span className={f.included ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <Button id={`upgrade-btn-${key}`} variant={isCurrent ? 'ghost' : key === 'elite' ? 'primary' : 'secondary'}
                className="w-full" disabled={isCurrent} onClick={() => handleUpgrade(key)}>
                {isCurrent ? <><i className="fa-solid fa-check" /> Current Plan</> : key === 'free' ? 'Switch to Free' : <><i className="fa-solid fa-arrow-up" /> Upgrade</>}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Payment loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-2xl">
            <Spinner size="xl" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Processing Payment</h3>
            <p className="text-sm text-zinc-400">Please wait while we process your upgrade...</p>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">Feature Comparison</h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table id="comp-table" className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide">Feature</th>
                  {PLAN_ORDER.map(key => {
                    const ac = PLAN_ACCENT[key] || PLAN_ACCENT.free;
                    return (
                      <th key={key} className={`text-center px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 ${key === currentPlan ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}>
                        <div className="flex items-center justify-center gap-1.5">
                          <i className={`fa-solid ${ac.icon} ${ac.text} text-xs`} />
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-xs">{PLANS[key].name}</span>
                          {key === currentPlan && <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">Active</span>}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={i} className={`border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-800/20'}`}>
                    <td className="px-5 py-3.5 font-medium text-zinc-700 dark:text-zinc-300">{row.label}</td>
                    {PLAN_ORDER.map(key => (
                      <td key={key} className={`px-5 py-3.5 text-center ${key === currentPlan ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''}`}>
                        {renderVal(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Transaction History</h2>
          <Button id="toggle-history-btn" variant="ghost" size="sm" onClick={() => setShowHistory(h => !h)}>
            <i className={`fa-solid ${showHistory ? 'fa-eye-slash' : 'fa-eye'}`} />
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
        </div>
        {showHistory && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            {txns.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <i className="fa-solid fa-receipt text-3xl text-zinc-300 dark:text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400">No transactions yet.</p>
              </div>
            ) : (
              txns.map((txn, i) => {
                const plan = PLANS[txn.plan] || PLANS.free;
                const ac = PLAN_ACCENT[txn.plan] || PLAN_ACCENT.free;
                return (
                  <div key={txn.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors ${i < txns.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${ac.bg}`}>
                      <i className={`fa-solid ${ac.icon} ${ac.text} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{plan.name} Plan — Monthly</p>
                      <p className="text-xs text-zinc-400">{formatDate(txn.date)} · {txn.txnId}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-amber-500">₹{txn.amount}</p>
                      <span className="text-[11px] font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{txn.status}</span>
                    </div>
                    <Button id={`invoice-btn-${txn.id}`} variant="ghost" size="xs" onClick={() => showToast(`Invoice ${txn.txnId} ready`, 'success', 2500)}>
                      <i className="fa-solid fa-file-invoice" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
