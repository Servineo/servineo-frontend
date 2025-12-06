'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

// *************************************************************
// 1. CONFIGURACIÓN DE URL Y CLAVES
// *************************************************************
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// 🟢 CONFIGURACIÓN: Usamos tu variable _MINE y limpiamos espacios (.trim())
const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_MINE || '').trim();

// ------------------------------------------------------------------
// Lógica Auxiliar y Componentes Internos
// ------------------------------------------------------------------
const isNumeric = (str: string) => /^\d+$/.test(str);

const PaymentSuccessContent = ({
  fixerId,
  onBack,
}: {
  fixerId: string | null;
  onBack: () => void;
}) => {
  return (
    <div className='min-h-screen bg-blue-600 flex items-center justify-center p-4'>
      <div className='max-w-xl mx-auto p-8 space-y-6 text-center bg-white rounded-xl shadow-2xl'>
        <CheckCircle className='mx-auto h-16 w-16 text-green-500' />
        <h2 className='text-3xl font-bold text-gray-800'>¡Operación Exitosa!</h2>
        <p className='text-lg text-gray-600'>
          Operación completada. ID de Fixer:{' '}
          <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
            {fixerId || 'N/A'}
          </span>
          .
        </p>
        <div className='p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm'>
          Tu cuenta bancaria ha sido actualizada.
        </div>
        <button
          onClick={onBack}
          className='w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md hover:shadow-lg'
        >
          Continuar al Centro de Pagos
        </button>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL (MiCuentaBancariaPage)
// ------------------------------------------------------------------
const MiCuentaBancariaPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ESTADOS DE LA LÓGICA DE NEGOCIO ---
  const [fixerId, setFixerId] = useState<string | null>(searchParams.get('fixerId'));
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // --- ESTADOS DE UI Y ERROR ---
  const [isIdLoading, setIsIdLoading] = useState(searchParams.get('fixerId') ? false : true);
  const isSuccessScreen = searchParams.get('status') === 'success';
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // --- ESTADOS DE FORMULARIO ---
  const [formData, setFormData] = useState({
    numeroCuenta: '',
    banco: 'Banco Nacional de Bolivia',
    nombreTitular: '',
    tipoCuenta: 'Cuenta de Ahorros',
    identificacion: '',
    identificationSuffix: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    numeroCuenta: '',
    nombreTitular: '',
    identificacion: '',
  });

  // 🟢 ESTADOS/REFERENCIAS PARA CAPTCHA
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setFormError(null);
      setDeleteError(null);
    }
  };

  useEffect(() => {
    if (!searchParams.get('fixerId')) {
      const storedId = localStorage.getItem('currentFixerId');
      if (storedId) {
        setFixerId(storedId);
      }
    }
    setIsIdLoading(false);

    if (localStorage.getItem('fix_bank_status') === 'CCB') {
      setAlreadyRegistered(true);
    } else {
      setAlreadyRegistered(false);
    }
  }, [searchParams, isSuccessScreen]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'numeroCuenta' && !isNumeric(value)) {
      error = 'La cuenta solo debe contener números.';
    }
    if (name === 'nombreTitular' && value.trim().length < 3) {
      error = 'El nombre del titular es demasiado corto.';
    }
    if (name === 'identificacion' && !isNumeric(value)) {
      error = 'La identificación solo debe contener números.';
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleGoBack = () => {
    const id = fixerId || '';
    router.replace(`/payment/centro-de-pagos?fixerId=${id}`);
  };

  // --- FUNCIÓN DE ELIMINACIÓN ---
  const handleDelete = async () => {
    if (!fixerId) {
      setDeleteError('Error: ID de Fixer no disponible para eliminar.');
      return;
    }

    if (!captchaToken) {
      setDeleteError(
        "Por favor, marca la casilla 'No soy un robot' para confirmar la eliminación.",
      );
      return;
    }

    setLoading(true);
    setDeleteError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/bank-accounts/${fixerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'g-recaptcha-response': captchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Fallo al eliminar (Status: ${response.status})`);
      }

      localStorage.setItem('fix_bank_status', 'SCB');
      localStorage.setItem(
        'statusMessage',
        'Cuenta bancaria eliminada exitosamente. Ahora puedes registrar una nueva.',
      );

      // 🟢 CORREGIDO: Redirección con ruta completa /payment/...
      router.push(`/payment/cuenta-bancaria?fixerId=${fixerId}&status=success`);
    } catch (error: unknown) {
      console.error('Error al eliminar la cuenta:', error);
      setDeleteError(`Error al eliminar la cuenta: ${error.message || 'Error desconocido.'}`);
    } finally {
      captchaRef.current?.reset();
      setCaptchaToken(null);
      setLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  // --- FUNCIÓN DE REGISTRO (POST) ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formIsValid =
      Object.keys(formData).every((key) =>
        validateField(key, formData[key as keyof typeof formData]),
      ) && Object.values(fieldErrors).every((err) => err === '');

    if (!formIsValid) {
      setFormError('Por favor, corrige los errores en el formulario.');
      return;
    }

    if (!captchaToken) {
      setFormError("Por favor, marca la casilla 'No soy un robot'.");
      return;
    }

    setLoading(true);

    const cleanNombre = formData.nombreTitular.trim().replace(/\s+/g, ' ');

    const dataToSend = {
      fixerId: fixerId,
      accountNumber: formData.numeroCuenta,
      bankName: formData.banco,
      nameFixer: cleanNombre,
      accountType: formData.tipoCuenta,
      identification:
        formData.identificacion +
        (formData.identificationSuffix ? '-' + formData.identificationSuffix.toUpperCase() : ''),
      'g-recaptcha-response': captchaToken,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/bank-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let userError = 'Error interno del servidor al registrar la cuenta bancaria.';

        if (errorData.message && errorData.message.includes('Duplicate account number')) {
          userError =
            'El número de cuenta bancaria ya ha sido registrado. Por favor, verifica tus datos.';
        } else if (errorData.message && errorData.message.includes('CAPTCHA')) {
          userError = errorData.message;
        } else if (errorData.message && errorData.message.includes('enum value')) {
          userError = `Error de validación: El tipo de cuenta seleccionado no es válido.`;
        } else if (errorData.message) {
          userError = errorData.message;
        }

        throw new Error(userError);
      }

      localStorage.setItem('fix_bank_status', 'CCB');
      localStorage.setItem('statusMessage', 'Cuenta bancaria registrada exitosamente.');

      // 🟢 CORREGIDO: Redirección con ruta completa /payment/...
      router.push(`/payment/cuenta-bancaria?fixerId=${fixerId}&status=success`);
    } catch (error: unknown) {
      console.error('Error en el flujo de registro:', error);
      setFormError(`Error al procesar la solicitud: ${error.message}`);
    } finally {
      captchaRef.current?.reset();
      setCaptchaToken(null);
      setLoading(false);
    }
  };

  // --- RENDERIZADO ---

  // 1. Vista de Éxito
  if (isSuccessScreen) {
    return <PaymentSuccessContent fixerId={fixerId} onBack={handleGoBack} />;
  }

  // 2. Vista de Carga o sin ID
  if (isIdLoading || !fixerId) {
    return (
      <div className='min-h-screen bg-blue-600 flex items-center justify-center'>
        <div className='text-white text-lg flex items-center'>
          <Loader2 className='animate-spin mr-3 h-6 w-6' />
          {isIdLoading ? 'Cargando ID de Fixer...' : 'ID de Fixer no encontrado.'}
        </div>
      </div>
    );
  }

  // 3. Vista de Confirmación de Eliminación
  if (showDeleteConfirmation) {
    return (
      <div className='min-h-screen bg-blue-600 flex items-center justify-center p-4'>
        <div className='max-w-xl mx-auto p-8 space-y-6 text-center bg-white rounded-xl shadow-2xl'>
          <h2 className='text-3xl font-bold text-red-600'>¿Eliminar Cuenta Bancaria?</h2>
          <p className='text-lg text-gray-600'>
            Confirma la eliminación de la cuenta bancaria asociada a tu ID:{' '}
            <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>{fixerId}</span>.
          </p>

          <div className='flex justify-center'>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>

          {deleteError && (
            <div className='p-3 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm'>
              {deleteError}
            </div>
          )}

          <div className='flex justify-center space-x-4'>
            <button
              onClick={() => {
                setShowDeleteConfirmation(false);
                captchaRef.current?.reset();
                setCaptchaToken(null);
              }}
              disabled={loading}
              className='bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md'
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || !captchaToken}
              className='bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md'
            >
              {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Vista de Cuenta Ya Registrada
  if (alreadyRegistered) {
    return (
      <div className='min-h-screen bg-blue-600 flex items-center justify-center p-4'>
        <div className='max-w-xl mx-auto p-6 space-y-4 text-center bg-white rounded-xl shadow-lg'>
          <h2 className='text-2xl font-semibold text-green-600 mb-4'>
            ¡Ya tienes una cuenta registrada!
          </h2>
          <p className='text-gray-700 mb-6'>
            Tu cuenta bancaria ya está asociada al ID:{' '}
            <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>{fixerId}</span>.
            <br /> Si deseas registrar una nueva, primero debes eliminar la actual.
          </p>
          <div className='flex justify-center space-x-4'>
            <button
              onClick={handleGoBack}
              className='bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md hover:shadow-lg'
            >
              Volver al Centro de Pagos
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirmation(true);
                captchaRef.current?.reset();
                setCaptchaToken(null);
              }}
              className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md hover:shadow-lg'
            >
              Eliminar Cuenta Existente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Vista de Formulario de Registro (Default)
  return (
    <div className='min-h-screen bg-blue-600 flex flex-col font-sans'>
      <header className='p-4 flex items-center justify-between bg-white shadow-md'>
        <button
          onClick={handleGoBack}
          className='flex items-center text-gray-700 hover:text-blue-600 transition duration-150'
        >
          <ChevronLeft className='w-5 h-5 mr-1' />
          Volver al Centro de Pagos
        </button>
        <h1 className='text-xl font-bold text-gray-800'>Registro de Cuenta Bancaria</h1>
        <div className='w-10'></div>
      </header>

      <div className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Asociar Cuenta</h2>
          <p className='text-gray-600 mb-6 border-b pb-4'>
            ID de Fixer:{' '}
            <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>{fixerId}</span>
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Campo Banco */}
            <div>
              <label htmlFor='banco' className='block text-sm font-medium text-gray-700 mb-1'>
                Banco
              </label>
              <select
                id='banco'
                name='banco'
                value={formData.banco}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
              >
                <option>Banco Nacional de Bolivia</option>
                <option>Banco Mercantil Santa Cruz</option>
                <option>Banco Unión</option>
                <option>Otro Banco</option>
              </select>
            </div>

            {/* Campo Tipo de Cuenta */}
            <div>
              <label htmlFor='tipoCuenta' className='block text-sm font-medium text-gray-700 mb-1'>
                Tipo de Cuenta
              </label>
              <select
                id='tipoCuenta'
                name='tipoCuenta'
                value={formData.tipoCuenta}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
              >
                <option>Cuenta de Ahorros</option>
                <option>Cuenta Corriente</option>
              </select>
            </div>

            {/* Campo Número de Cuenta */}
            <div>
              <label
                htmlFor='numeroCuenta'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Número de Cuenta <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='numeroCuenta'
                name='numeroCuenta'
                value={formData.numeroCuenta}
                onChange={handleChange}
                maxLength={20}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.numeroCuenta ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.numeroCuenta && (
                <p className='text-red-500 text-xs mt-1'>{fieldErrors.numeroCuenta}</p>
              )}
            </div>

            {/* Campo Nombre del Titular */}
            <div>
              <label
                htmlFor='nombreTitular'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Nombre Completo del Titular <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='nombreTitular'
                name='nombreTitular'
                value={formData.nombreTitular}
                onChange={handleChange}
                maxLength={100}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.nombreTitular ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.nombreTitular && (
                <p className='text-red-500 text-xs mt-1'>{fieldErrors.nombreTitular}</p>
              )}
            </div>

            {/* Campo Identificación */}
            <div className='flex space-x-2'>
              <div className='flex-grow'>
                <label
                  htmlFor='identificacion'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Nro. Identificación <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='identificacion'
                  name='identificacion'
                  value={formData.identificacion}
                  onChange={handleChange}
                  maxLength={15}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.identificacion ? 'border-red-500' : 'border-gray-300'}`}
                />
                {fieldErrors.identificacion && (
                  <p className='text-red-500 text-xs mt-1'>{fieldErrors.identificacion}</p>
                )}
              </div>
              <div className='w-16'>
                <label
                  htmlFor='identificationSuffix'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Sufijo
                </label>
                <input
                  type='text'
                  id='identificationSuffix'
                  name='identificationSuffix'
                  value={formData.identificationSuffix}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder='Ej: CH'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase'
                />
              </div>
            </div>

            {/* 🟢 COMPONENTE CAPTCHA */}
            <div className='pt-2'>
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              />
            </div>

            {formError && (
              <div className='p-3 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm transition-all duration-300'>
                <AlertCircle className='inline w-4 h-4 mr-2' />
                {formError}
              </div>
            )}

            <button
              type='submit'
              disabled={loading || !captchaToken}
              className={`w-full font-semibold py-3 rounded-lg mt-6 transition duration-150 ease-in-out shadow-lg 
                    ${loading || !captchaToken ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'}`}
            >
              {loading ? (
                <span className='flex items-center justify-center'>
                  <Loader2 className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' />
                  Guardando...
                </span>
              ) : (
                'Guardar cuenta'
              )}
            </button>

            <button
              type='button'
              onClick={handleGoBack}
              className='w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2 transition duration-150'
            >
              Cancelar y Volver al Centro de Pagos
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MiCuentaBancariaPage;
