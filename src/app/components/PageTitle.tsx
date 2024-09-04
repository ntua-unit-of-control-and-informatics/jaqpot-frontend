interface PageTitleProps {
  title: string;
}

export default function PageTitle(props: PageTitleProps & any) {
  return (
    <div {...props}>
      <h1 className="text-3xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        {props.title}
      </h1>
    </div>
  );
}
