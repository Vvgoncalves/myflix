import React, { useState } from 'react';
import { X, Server, Key, Check, ShieldCheck, Database, RefreshCw, AlertCircle } from 'lucide-react';
import {
  SERVERS,
  getStoredServer,
  setStoredServer,
  getStoredApiKey,
  setStoredApiKey
} from '../services/api';

export default function SettingsModal({ onClose, onReloadData }) {
  const [selectedServer, setSelectedServerState] = useState(getStoredServer());
  const [apiKey, setApiKeyState] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setStoredServer(selectedServer);
    setStoredApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onReloadData) onReloadData();
      onClose();
    }, 800);
  };

  const handleReset = () => {
    localStorage.removeItem('superflix_server_url');
    localStorage.removeItem('superflix_tmdb_key');
    setSelectedServerState('server1');
    setApiKeyState('bb95a32b21703f8e56baec11c251d7c4');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onReloadData) onReloadData();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-wine-900/60 border border-wine-700 text-wine-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Configurações do SuperFlix
              </h2>
              <p className="text-xs text-dark-400">Servidores do player e chave de catálogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-wine-600 text-dark-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Server Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-dark-300 uppercase tracking-wider block">
              Servidor Padrão do Player SuperFlix:
            </label>
            <div className="space-y-2">
              {SERVERS.map((srv) => (
                <label
                  key={srv.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedServer === srv.id
                      ? 'bg-wine-950/60 border-wine-500 text-white shadow-wine-glow'
                      : 'bg-dark-850 hover:bg-dark-800 border-dark-750 text-dark-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="server"
                      value={srv.id}
                      checked={selectedServer === srv.id}
                      onChange={() => setSelectedServerState(srv.id)}
                      className="accent-wine-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{srv.name}</p>
                      <p className="text-[11px] text-dark-400 font-mono">{srv.baseUrl}</p>
                    </div>
                  </div>
                  {selectedServer === srv.id && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-wine-600 text-white">
                      Ativo
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* TMDB API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">
                Chave da API TMDB (Metadados):
              </label>
              <span className="text-[11px] text-dark-400">Opcional</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                placeholder="Insira sua TMDB API Key..."
                className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-dark-100 placeholder-dark-500 focus:border-wine-500 focus:outline-none"
              />
              <Key className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-dark-400">
              Uma chave pública já está configurada. Se possuir sua própria chave gratuita do
              themoviedb.org, cole-a acima.
            </p>
          </div>

          {/* Status info box */}
          <div className="p-3 rounded-xl bg-dark-850 border border-dark-750/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-dark-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Formato de Embed:
              </span>
              <span className="text-dark-200 font-mono text-[11px]">TMDB ID (/filme/ e /serie/)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-wine-400" /> Modo Offline/Fallback:
              </span>
              <span className="text-emerald-400 font-semibold">Ativo com 60+ títulos</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-semibold text-dark-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restaurar Padrões
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-dark-300 hover:text-white bg-dark-800 hover:bg-dark-750 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="wine-gradient-btn px-5 py-2 rounded-xl text-xs font-bold text-white shadow-wine-glow flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Salvo!
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

