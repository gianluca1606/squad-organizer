const DialogLayout = ({ children, innerRef }: any) => {
  return (
    <div className="z-60 fixed inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-opacity-100 outline-none focus:outline-none">
      <div
        className="mx-auto my-6 w-full max-w-3xl opacity-100 sm:w-8/12 md:w-8/12 "
        ref={innerRef}
      >
        {children}
      </div>
    </div>
  );
};

export default DialogLayout;
