import Spinner from "@/components/Spinner";

const Loading = () => {
  return (
    <section
      className="w-screen h-screen flex items-center justify-center"
      style={{ backgroundColor: "transparent" }}
    >
      <Spinner />
    </section>
  );
};

export default Loading;
