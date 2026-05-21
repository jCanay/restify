import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router";

/**
 * @param {object} props
 * @param {Object[]} props.links
 * @param {string} props.links[].label
 * @param {string} props.links[].url
 */
export const Breadcrums = ({ links = [] }) => {
    return (
        <ul className="flex items-center">
            {links?.map((link, i) => {
                if (i == links.length - 1) {
                    return <span key={i}>{link?.label}</span>;
                }

                return (
                    <div key={i} className="flex items-center">
                        <NavLink
                            className="font-bold hover:underline"
                            to={link?.url}
                        >
                            {link?.label}
                        </NavLink>
                        <ChevronRight strokeWidth={1.5} size={20} />
                    </div>
                );
            })}
        </ul>
    );
};
