export default function Container({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component className={["mx-auto w-full max-w-container px-4 sm:px-6", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Component>
  );
}

