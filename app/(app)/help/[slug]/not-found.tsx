export default function HelpNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <h1 className="text-2xl font-semibold">Help Topic Not Found</h1>
      <p className="text-sm text-muted-foreground">
        This help topic does not exist. Browse all available topics below.
      </p>
    </div>
  )
}
