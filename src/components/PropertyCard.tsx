import React from "react";
import { Property } from "../types";

export const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(property.price);

    return (
        <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                    src={property.imageUrl}
                    alt={property.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <span className="text-xl font-bold text-slate-900">
                    {formattedPrice}
                </span>

                <h2 className="mt-1 text-lg font-semibold text-slate-800">
                    {property.title}
                </h2>

                <address className="mt-1 text-sm not-italic text-slate-600">
                    {property.location.address}, {property.location.city},{" "}
                    {property.location.state}
                </address>

                <ul className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
                    <li>
                        <strong>{property.bedrooms}</strong> beds
                    </li>
                    <li>
                        <strong>{property.bathrooms}</strong> baths
                    </li>
                    {property.sqft && (
                        <li>
                            <strong>{property.sqft}</strong> sqft
                        </li>
                    )}
                </ul>

                <div className="mt-auto pt-4">
                    <a
                        href={`/properties/${property.id}`}
                        aria-label={`View details for ${property.title} on ${property.location.address}`}
                        className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        View Details
                    </a>
                </div>
            </div>
        </article>
    );
};