//reusable container for features section of landing page

export default function FeatContainer({ children }) {
    return (
        <div
        className="
        flex
        bg-[#B1D4E0]
        text-black
        rounded-[1.25rem]
        py-[10]
        px-[10]
        "
        >
            {children}
        </div>
    )
}