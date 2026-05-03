import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { fetchWithApiFallback } from '../utils/serviceConfig';
import { firebaseClientErrorToUserMessage } from '../utils/firebaseUserFacingError';

const ADMIN_TOKEN_KEY = 'feetiplay_admin_token';
const USER_TOKEN_KEY  = 'feetiplay_token';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  /** 'square' pour avatar, 'wide' pour bannière/event */
  aspect?: 'square' | 'wide';
}

export function ImageUpload({ value, onChange, folder = 'feetiplay', label = 'Image', aspect = 'wide' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Seules les images sont acceptées.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Taille max : 5 Mo.'); return; }

    setError('');
    setUploading(true);
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(USER_TOKEN_KEY);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetchWithApiFallback(`/upload/image?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const body = await res.json().catch(() => ({ message: 'Erreur serveur' }));
      if (!res.ok) throw new Error(body.message ?? 'Erreur upload');
      onChange(body.url);
    } catch (err) {
      setError(firebaseClientErrorToUserMessage(err, 'Erreur lors de l\'upload.'));
    } finally {
      setUploading(false);
    }
  };

  const isWide = aspect === 'wide';

  return (
    <div>
      <label className="block text-white/60 text-xs mb-1.5">{label}</label>

      <div
        className={`relative group cursor-pointer rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:border-[#cdff71]/50 transition-colors ${
          isWide ? 'h-36' : 'h-24 w-24'
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {/* Preview */}
        {value ? (
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/30">
            <Upload className="w-6 h-6" />
            <span className="text-xs">Cliquer pour uploader</span>
          </div>
        )}

        {/* Overlay au survol */}
        {!uploading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-6 h-6 text-[#cdff71]" />
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#cdff71] animate-spin" />
          </div>
        )}
      </div>

      {/* Bouton effacer */}
      {value && !uploading && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onChange(''); }}
          className="mt-1.5 flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          <X className="w-3 h-3" /> Supprimer l'image
        </button>
      )}

      {error && <p className="mt-1.5 text-[#DE0035] text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
