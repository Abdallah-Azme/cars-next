
const PageHeader = ({
  title,
}: {
  title: string;
}) => {
  return (
    <div className="md:h-[40vh] h-[20vh] bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat">
        <div className="w-full h-full bg-black/70 flex items-center justify-center">
        <h1 className="md:text-6xl text-4xl font-bold text-white tracking-wider">{title}</h1>
        </div>
    </div>
  )
}

export default PageHeader
