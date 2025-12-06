'use client';
import { useEffect, useState } from 'react';
import AddCardModalFixer from './AddCardModalFiver';
import { motion, AnimatePresence } from 'framer-motion';

interface CardListFixerProps {
  fixerId: string;
  amount: number;
  onRechargeSuccess: () => void;
  recaptchaToken: string | null;
}

interface Card {
  _id: string;
  brand?: string;
  last4: string;
  expMonth: string | number;
  expYear: string | number;
  cardholderName?: string;
  isDefault?: boolean;
}

export default function CardListFixer({
  fixerId,
  amount,
  onRechargeSuccess,
  recaptchaToken,
}: CardListFixerProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [processingCardId, setProcessingCardId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState<Card | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const fetchCards = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/cards?userId=${fixerId}`);
      if (!res.ok) throw new Error('Error fetching cards');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error('Error obteniendo tarjetas:', err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [fixerId]); // Añadido fixerId como dependencia

  const confirmRecharge = (card: Card) => setConfirmModal(card);

  const handleRecharge = async (card: Card) => {
    if (processingCardId) return;

    if (!recaptchaToken) {
      alert('Error de seguridad: Falta la verificación reCAPTCHA. Intenta nuevamente.');
      return;
    }

    setProcessingCardId(card._id);
    setConfirmModal(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/wallet/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          userId: fixerId,
          cardId: card._id,
          recaptchaToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al recargar wallet');
      
      showSuccessModal(
        `💰 Recarga exitosa: +${amount} BOB (nuevo balance: ${data.wallet.balance} BOB)`
      );
      onRechargeSuccess?.();
    } catch (err) {
      console.error(err);
      alert(
        'Error al recargar la wallet. Asegúrate de que tu monto sea válido y la tarjeta tenga fondos.'
      );
    } finally {
      setProcessingCardId(null);
    }
  };

  const showSuccessModal = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#D1D5DB] p-10 text-black relative">
      <div className="flex justify-between items-center gap-3 mb-10">
        <h1 className="text-3xl font-extrabold">Mis Tarjetas Guardadas</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[#2B6AE0] rounded-xl shadow-lg hover:bg-[#2BDDE0] transition-all font-semibold flex items-center gap-2"
        >
          Agregar➕
        </motion.button>
      </div>

      {cards.length === 0 ? (
        <p className="text-center text-gray-400">No tienes tarjetas guardadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl shadow-2xl p-6 bg-[#1AA7ED] text-black"
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-semibold uppercase">{card.brand}</p>
                <img
                  src={
                    card.brand?.toLowerCase() === 'visa'
                      ? 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
                      : card.brand?.toLowerCase() === 'mastercard'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
                        : 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Generic-credit-card-icon.svg'
                  }
                  alt="brand"
                  className="h-6 w-auto"
                />
              </div>

              <div className="text-2xl tracking-widest font-mono mb-4">
                **** **** **** {card.last4}
              </div>

              <div className="flex justify-between text-sm opacity-90">
                <div>
                  <p className="uppercase">Expira</p>
                  <p className="font-semibold">
                    {card.expMonth}/{card.expYear}
                  </p>
                </div>
                <div className="text-right">
                  <p className="uppercase">Titular</p>
                  <p className="font-semibold truncate w-32">
                    {card.cardholderName || 'usuario'}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => confirmRecharge(card)}
                disabled={processingCardId === card._id}
                className={`mt-6 w-full py-2 rounded-xl font-bold text-white shadow-lg ${
                  processingCardId === card._id
                    ? 'bg-[#2B6AE0] cursor-not-allowed'
                    : 'bg-[#2B6AE0] hover:bg-[#2BDDE0]'
                }`}
              >
                {processingCardId === card._id ? 'Procesando...' : `Recargar ${amount} BOB`}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <AddCardModalFixer
          userId={fixerId}
          amount={amount}
          recaptchaToken={recaptchaToken}
          onClose={() => setShowModal(false)}
          onCardAdded={() => fetchCards()}
        />
      )}

      {/* Modal de confirmación */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-[#2B6AE0] p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full"
            >
              <h2 className="text-xl font-bold mb-4">⚠️ Confirmar Recarga</h2>
              <p className="text-black mb-6">
                ¿Deseas recargar <span className="font-bold text-[#2BDDE0]">{amount} BOB</span> a
                tu wallet con la tarjeta terminada en{' '}
                <span className="font-bold">{confirmModal.last4}</span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-5 py-2 bg-[#D1D5DB] rounded-xl hover:bg-[#2BDDE0]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleRecharge(confirmModal)}
                  className="px-5 py-2 bg-[#D1D5DB] rounded-xl hover:bg-[#2BDDE0] font-semibold"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de éxito */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50"
          >
            <div className="bg-[#2B6AE0] text-black px-10 py-6 rounded-2xl shadow-xl text-center">
              <h2 className="text-xl font-bold mb-3">¡Recarga Exitosa!</h2>
              <p>{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}