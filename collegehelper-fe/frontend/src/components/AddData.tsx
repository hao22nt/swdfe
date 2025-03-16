import React, { ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface AddDataProps<T> {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (data: T) => void;
  fields?: Field[];
  initialData?: Partial<T>;
}

const AddData = <T,>({
  slug,
  isOpen,
  setIsOpen,
  onSubmit,
  fields = [],
  initialData = {},
}: AddDataProps<T>): JSX.Element => {
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<T>>(initialData);
  const [formIsEmpty, setFormIsEmpty] = React.useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData as T);
    } else {
      toast('Gabisa dong!', { icon: '😛' });
    }
  };

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    const requiredFields = fields.filter((field) => field.required);
    const isEmpty = requiredFields.some((field) => !formData[field.name as keyof T]);
    setFormIsEmpty(isEmpty);
  }, [formData, fields]);

  if (!isOpen) return <></>; // Trả về fragment rỗng thay vì null

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
      <div
        className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
          showModal ? 'translate-y-0' : 'translate-y-full'
        } ${showModal ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
          <button
            onClick={() => {
              setShowModal(false);
              setIsOpen(false);
            }}
            className="absolute top-5 right-3 btn btn-ghost btn-circle"
          >
            <HiOutlineXMark className="text-xl font-bold" />
          </button>
          <span className="text-2xl font-bold">
            {formData && Object.keys(formData).length > 0 ? 'Edit' : 'Add new'} {slug.replace('-', ' ')}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <div key={field.name} className="form-control w-full">
              <div className="label">
                <span className="label-text">{field.label}</span>
              </div>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  placeholder={field.label}
                  className="textarea textarea-bordered w-full"
                  value={(formData[field.name as keyof T] as string | undefined) ?? ''}
                  onChange={handleChange}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  className="input input-bordered w-full"
                  value={(formData[field.name as keyof T] as string | number | undefined) ?? ''}
                  onChange={handleChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button
            className={`mt-5 btn ${formIsEmpty ? 'btn-disabled' : 'btn-primary'} btn-block font-semibold`}
            disabled={formIsEmpty}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddData;