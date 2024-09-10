function Button({className, href, onClick, children, px,
    white
}) {
    const classes = `button relative inline-flex items-center justify-center h-9
    transition-colors hover:text-color-1 ${px || "px-7"}
    ${white ? "text-n-8" : "text-n-1"} ${className || ""}`; 

    return (
        <button className={classes} onClick={onClick} {...(href && { as: 'a', href })}>
            <span>{children}</span>
        </button>
    );
    
}

export default Button