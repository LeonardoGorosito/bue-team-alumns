import ConfirmationModal from './ConfirmationModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function FanslyValidationModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Verificación Requerida — Master Atlas"
      confirmText="He comprado en Fansly, continuar"
      message={
        <div className="space-y-4 text-left">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-blue-700 font-bold">Información para alumnas:</p>
            <p className="text-blue-600 text-sm">
              Este curso tiene un requisito previo de acceso.
            </p>
          </div>
          <p className="text-gray-700 font-medium">
            Solo se aceptará la compra si anteriormente compraste la Master en  <span className="text-indigo-600 font-bold">Fansly</span>.
          </p>
          <p className="text-sm text-gray-500">
            Si no cumples con esta condición, no se habilitará el contenido y no se realizarán reembolsos. Al hacer clic en continuar, confirmas que eres alumna de Fansly.
          </p>
        </div>
      }
    />
  )
}