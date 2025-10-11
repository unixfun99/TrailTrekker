import HikeForm from '../HikeForm';

export default function HikeFormExample() {
  return (
    <div className="p-4 max-w-lg">
      <HikeForm onSubmit={(data) => console.log('Form submitted:', data)} />
    </div>
  );
}