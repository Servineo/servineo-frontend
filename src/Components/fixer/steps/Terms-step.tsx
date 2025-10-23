"use client"

import { Card } from "@/Components/Card"

interface TermsStepProps {
  accepted: boolean
  onAcceptChange: (accepted: boolean) => void
  error?: string
}

export function TermsStep({ accepted, onAcceptChange, error }: TermsStepProps) {
  return (
    <Card title="Términos y Condiciones">
      <div className="space-y-4">
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <h3 className="font-semibold text-gray-900 mb-2">Términos y Condiciones para FIXERS</h3>

          <div className="space-y-3">
            <section>
              <h4 className="font-medium text-gray-800 mb-1">1. Aceptación de Términos</h4>
              <p className="text-xs leading-relaxed">
                Al registrarse como FIXER, usted acepta cumplir con todos los términos y condiciones establecidos en
                este documento. Estos términos rigen su uso de la plataforma y la prestación de servicios.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-gray-800 mb-1">2. Responsabilidades del FIXER</h4>
              <p className="text-xs leading-relaxed">
                Como FIXER, usted se compromete a: (a) proporcionar servicios de calidad profesional, (b) cumplir con
                los horarios acordados, (c) mantener una comunicación clara con los clientes, (d) utilizar herramientas
                y materiales apropiados, y (e) respetar la propiedad del cliente.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-gray-800 mb-1">3. Pagos y Comisiones</h4>
              <p className="text-xs leading-relaxed">
                La plataforma cobrará una comisión del 15% sobre cada trabajo completado. Los pagos se procesarán dentro
                de 3-5 días hábiles después de la finalización del servicio. Si seleccionó QR o tarjeta, los pagos se
                realizarán a través de la plataforma.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-gray-800 mb-1">4. Verificación de Identidad</h4>
              <p className="text-xs leading-relaxed">
                Su CI debe ser válido y único en la plataforma. Nos reservamos el derecho de verificar su identidad y
                solicitar documentación adicional si es necesario.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-gray-800 mb-1">5. Cancelación y Suspensión</h4>
              <p className="text-xs leading-relaxed">
                La plataforma se reserva el derecho de suspender o cancelar su cuenta si se detectan violaciones a estos
                términos, comportamiento inapropiado, o quejas recurrentes de clientes.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-gray-800 mb-1">6. Privacidad y Datos</h4>
              <p className="text-xs leading-relaxed">
                Sus datos personales serán tratados conforme a nuestra Política de Privacidad. La información de
                ubicación y servicios será visible para los usuarios que busquen FIXERS en su área.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-gray-800 mb-1">7. Modificaciones</h4>
              <p className="text-xs leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán
                notificados a través de la plataforma y entrarán en vigor inmediatamente.
              </p>
            </section>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => onAcceptChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            He leído y acepto los términos y condiciones para convertirme en FIXER
          </span>
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Card>
  )
}
