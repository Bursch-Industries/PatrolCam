//reusable container for features section of landing page

export default function FeatContainer({ children }) {
    return (
        <div
        className="
        flex
        bg-[#B1D4E0]
        text-black
        rounded-[1.25rem]
        py-[8rem]
        px-[6rem]
        mt-[2rem]
        "
        >
            {children}
        </div>
    )
}