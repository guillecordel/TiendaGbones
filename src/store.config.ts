import AccessoriesImage from "@/images/accessories.jpg";
import ApparelImage from "@/images/apparel.jpg";

export const config = {
	categories: [
		{ name: "Apparel", slug: "apparel", image: ApparelImage },
		{ name: "Accessories", slug: "accessories", image: AccessoriesImage },
	],

	social: {
		x: "https://x.com/gbones",
		facebook: "https://facebook.com/gbones",
	},

	contact: {
		email: "contact@gbones.com",
		phone: "+1 (555) 000-0000",
		address: "Gbones Fashion Store",
	},
};

export type StoreConfig = typeof config;
export default config;
