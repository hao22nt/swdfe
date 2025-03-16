import React, { ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import { AdmissionInput } from '../api/ApiCollection';

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface AddDataProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (data: AdmissionInput) => void;
  fields?: Field[];
  initialData?: Partial<AdmissionInput>; // Giữ nguyên kiểu này
}

const AddData: React.FC<AddDataProps> = ({
  slug,
  isOpen,
  setIsOpen,
  onSubmit,
  fields = [],
  initialData = {},
}) => {
  const [showModal, setShowModal] = React.useState(false);
  // Cập nhật kiểu của formData để chấp nhận null
  const [formData, setFormData] = React.useState<{ [key: string]: string | null }>(
    // Chuyển đổi initialData để đảm bảo tương thích
    {
      methodName: initialData.methodName || '',
      requiredDocuments: initialData.requiredDocuments || null,
      description: initialData.description || null,
    }
  );
  const [formIsEmpty, setFormIsEmpty] = React.useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const admissionData: AdmissionInput = {
        methodName: formData.methodName || '', // methodName là bắt buộc, không thể null
        requiredDocuments: formData.requiredDocuments || null,
        description: formData.description || null,
      };
      onSubmit(admissionData);
    } else {
      toast('Gabisa dong!', { icon: '😛' });
    }
  };

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    const requiredFields = fields.filter((field) => field.required);
    const isEmpty = requiredFields.some((field) => !formData[field.name] || formData[field.name] === '');
    setFormIsEmpty(isEmpty);
  }, [formData, fields]);

  if (!isOpen) return null;

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
          <span className="text-2xl font-bold">{initialData.methodName ? 'Edit' : 'Add new'} {slug.replace('-', ' ')}</span>
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
                  value={formData[field.name] ?? ''} // Chuyển null thành chuỗi rỗng để hiển thị
                  onChange={handleChange}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  className="input input-bordered w-full"
                  value={formData[field.name] ?? ''} // Chuyển null thành chuỗi rỗng để hiển thị
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