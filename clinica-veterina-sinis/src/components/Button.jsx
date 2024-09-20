function Button({className, href, onClick, children, px
}) {
    const classes = `button relative inline-flex items-center justify-center h-10
    font-bold border-2 rounded-md px-3 py-1 transition-all 
    ${px || "px-7"} ${className || ""}`; 

    return (
        <button className={classes} onClick={onClick} {...(href && { as: 'a', href })}>
            <span>{children}</span>
        </button>
    );
    
}

export default Button