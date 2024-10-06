import LoadingSpinner from "./LoadingSpinner"

function Loading({ text }) {

    return (
        <>
            <div className="fixed top-0 left-0 flex flex-col items-center justify-center min-h-screen w-full bg-bgprimary z-50">
                <div className="font-bold text-4xl text-primary pb-10">
                    {text}
                </div>
                <LoadingSpinner />
            </div>
        </>
    )


} export default Loading