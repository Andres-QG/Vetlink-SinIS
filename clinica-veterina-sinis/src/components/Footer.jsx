function Footer() {

    return (
        <>
            <hr className="border-t border-white" />
            <footer className="bg-blue-600 text-white py-4">
                <div className="container mx-auto flex justify-between items-center px-4 mt-2">
                    <div className="text-sm">
                        &copy; {new Date().getFullYear()} PetLink. Todos los derechos reservados.
                    </div>
                    <div>
                        {/* Add any additional footer content here */}
                    </div>
                </div>
            </footer>
        </>
    )

}

export default Footer