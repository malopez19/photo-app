import PhotoCard from "./PhotoCard";

export default function PhotoGrid({
	groups,
	selectedIds,
	onToggleSelect,
	onSelectMedia,
	onToggleFavorite,
}) {
	return (
		<div className="space-y-8 pb-12">
			{groups.map((group) => (
				<section key={group.date} className="space-y-3">
					<h2 className="text-sm font-bold text-slate-500 tracking-wider uppercase top-16 bg-slate-50/90 backdrop-blur-md py-2 z-10">
						{group.date}
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
						{group.items.map((item) => (
							<PhotoCard
								key={item.id}
								media={item}
								isSelected={selectedIds.includes(item.id)}
								onToggleSelect={onToggleSelect}
								onSelectMedia={onSelectMedia}
								onToggleFavorite={onToggleFavorite}
							/>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
