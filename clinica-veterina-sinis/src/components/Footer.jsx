function Footer() {

    return (
        <>
            <hr className="border-t border-tertiary" />
            <footer className="bg-primary text-white py-4">
                <div className="w-full mx-auto flex justify-between items-center px-4 mt-2">
                    <div className="text-sm text-text">
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