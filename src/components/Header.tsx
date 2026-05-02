import { Link } from "react-router";

export default function Header(){
    return(
        <div className="border-b-2 bg-[#D9D9D9] py-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/">
                    <span className="text-2xl font-bold">INICIO</span>
                </Link>
            </div>
        </div>
    )
}