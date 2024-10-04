import LoadingSpinner from "./LoadingSpinner"

function Loading() {

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="font-bold text-4xl text-primary pb-10">
                    Autenticando Rol...
                </div>
                <LoadingSpinner />
            </div>
        </>
    )


} export default Loading