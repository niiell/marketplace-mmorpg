"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
	{
		content:
			"Transaksi cepat, aman, dan supportnya responsif. Marketplace terbaik untuk jual beli gold Ragnarok!",
		author: "Andi",
		role: "Seller",
		location: "Jakarta",
		avatar: "/images/andi.jpg",
	},
	{
		content:
			"Suka banget fitur chat real-time-nya. Penjual ramah dan prosesnya jelas.",
		author: "Maya",
		role: "Buyer",
		location: "Surabaya",
		avatar: "/images/maya.jpg",
	},
	{
		content: "Escrow system-nya bikin tenang. Nggak takut kena scam lagi!",
		author: "Kevin",
		role: "Buyer",
		location: "Bangkok",
		avatar: "/images/kevin.jpg",
	},
];

export default function Testimonials() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
					className="text-center mb-16"
				>
					<motion.h2
						variants={itemVariants}
						className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
					>
						Kata Mereka Tentang Kami
					</motion.h2>
					<motion.p
						variants={itemVariants}
						className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
					>
						Pengalaman nyata dari pengguna marketplace kami
					</motion.p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							whileHover={{ y: -8 }}
							className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200"
						>
							<div className="flex flex-col h-full">
								<div className="flex-grow">
									<div className="text-yellow-400 mb-4">★★★★★</div>
									<p className="text-gray-600 dark:text-gray-300 italic mb-6">
										"{testimonial.content}"
									</p>
								</div>

								<div className="flex items-center mt-4">
									<div className="relative w-12 h-12">
										<Image
											src={testimonial.avatar}
											alt={testimonial.author}
											fill
											className="rounded-full object-cover"
										/>
									</div>
									<div className="ml-4">
										<p className="font-semibold text-gray-900 dark:text-white">
											{testimonial.author}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{testimonial.role} • {testimonial.location}
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}