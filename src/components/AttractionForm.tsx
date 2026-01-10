import { useMemo, useState } from 'react';
import { Button, Input, Textarea, type BadgeCategory } from '@/components/ui';

export interface AttractionFormValues {
  name: string;
  chineseAddress: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  category: BadgeCategory;
  notes?: string;
}

interface AttractionFormProps {
  title: string;
  submitLabel: string;
  initialValues?: Partial<AttractionFormValues>;
  onSave: (values: AttractionFormValues) => void;
  onCancel: () => void;
}

type FormState = {
  name: string;
  chineseAddress: string;
  latitude: string;
  longitude: string;
  category: BadgeCategory;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const CATEGORY_OPTIONS: Array<{ value: BadgeCategory; label: string }> = [
  { value: 'monument', label: 'Monumento' },
  { value: 'museum', label: 'Museu' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'temple', label: 'Templo' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'shopping', label: 'Compras' },
  { value: 'other', label: 'Outro' },
];

function getInitialState(initialValues?: Partial<AttractionFormValues>): FormState {
  return {
    name: initialValues?.name ?? '',
    chineseAddress: initialValues?.chineseAddress ?? '',
    latitude: initialValues?.coordinates?.latitude?.toString() ?? '',
    longitude: initialValues?.coordinates?.longitude?.toString() ?? '',
    category: initialValues?.category ?? 'other',
    notes: initialValues?.notes ?? '',
  };
}

function validateForm(state: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!state.name.trim()) {
    errors.name = 'Informe o nome da atração.';
  }

  if (!state.chineseAddress.trim()) {
    errors.chineseAddress = 'Informe o endereço em chinês.';
  }

  const hasLatitude = state.latitude.trim() !== '';
  const hasLongitude = state.longitude.trim() !== '';

  if (hasLatitude !== hasLongitude) {
    errors.latitude = 'Preencha latitude e longitude.';
    errors.longitude = 'Preencha latitude e longitude.';
  }

  if (hasLatitude && Number.isNaN(Number(state.latitude))) {
    errors.latitude = 'Latitude inválida.';
  }

  if (hasLongitude && Number.isNaN(Number(state.longitude))) {
    errors.longitude = 'Longitude inválida.';
  }

  return errors;
}

export default function AttractionForm({
  title,
  submitLabel,
  initialValues,
  onSave,
  onCancel,
}: AttractionFormProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    getInitialState(initialValues)
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const isFormValid = useMemo(
    () => !Object.keys(validateForm(formState)).length,
    [formState]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(formState);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const hasCoordinates = formState.latitude.trim() && formState.longitude.trim();
    const coordinates = hasCoordinates
      ? {
          latitude: Number(formState.latitude),
          longitude: Number(formState.longitude),
        }
      : undefined;

    onSave({
      name: formState.name.trim(),
      chineseAddress: formState.chineseAddress.trim(),
      coordinates,
      category: formState.category,
      notes: formState.notes.trim() || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
        <p className="mt-2 text-neutral-600">
          Preencha os dados da atração e salve para continuar.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-8 shadow-md"
        noValidate
      >
        <fieldset className="grid gap-6">
          <legend className="sr-only">Informações da atração</legend>

          <Input
            name="name"
            label="Nome da atração *"
            value={formState.name}
            onChange={handleChange}
            placeholder="Ex: Cidade Proibida"
            hasError={!!errors.name}
            errorMessage={errors.name}
            fullWidth
            required
            aria-required="true"
          />

          <Input
            name="chineseAddress"
            label="Endereço em chinês *"
            value={formState.chineseAddress}
            onChange={handleChange}
            placeholder="Ex: 北京市东城区景山前街4号"
            hasError={!!errors.chineseAddress}
            errorMessage={errors.chineseAddress}
            fullWidth
            required
            aria-required="true"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="latitude"
              label="Latitude"
              value={formState.latitude}
              onChange={handleChange}
              placeholder="Ex: 39.91635"
              hasError={!!errors.latitude}
              errorMessage={errors.latitude}
              fullWidth
              inputMode="decimal"
            />
            <Input
              name="longitude"
              label="Longitude"
              value={formState.longitude}
              onChange={handleChange}
              placeholder="Ex: 116.39715"
              hasError={!!errors.longitude}
              errorMessage={errors.longitude}
              fullWidth
              inputMode="decimal"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="text-sm font-medium font-body text-neutral-700"
            >
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="w-full rounded-base border border-neutral-300 bg-white px-4 py-3 text-base font-body text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            name="notes"
            label="Notas"
            value={formState.notes}
            onChange={handleChange}
            placeholder="Adicione observações importantes..."
            fullWidth
          />
        </fieldset>

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
