export function Table({ className = "", children, ...props }) {
  return <div className="overflow-x-auto rounded-card border border-border bg-surface"><table className={["w-full border-collapse text-left text-body", className].filter(Boolean).join(" ")} {...props}>{children}</table></div>;
}

export function TableHead({ className = "", children, ...props }) {
  return <thead className={["sticky top-0 z-10 bg-surface text-caption text-muted", className].filter(Boolean).join(" ")} {...props}>{children}</thead>;
}

export function TableBody({ className = "", children, ...props }) {
  return <tbody className={["divide-y divide-border", className].filter(Boolean).join(" ")} {...props}>{children}</tbody>;
}

export function TableRow({ className = "", children, ...props }) {
  return <tr className={["border-b border-border transition-colors last:border-b-0 hover:bg-surface-alt", className].filter(Boolean).join(" ")} {...props}>{children}</tr>;
}

export function TableHeaderCell({ className = "", children, ...props }) {
  return <th scope="col" className={["whitespace-nowrap px-5 py-4 font-medium", className].filter(Boolean).join(" ")} {...props}>{children}</th>;
}

export function TableCell({ className = "", children, ...props }) {
  return <td className={["px-5 py-4", className].filter(Boolean).join(" ")} {...props}>{children}</td>;
}

export default Table;
