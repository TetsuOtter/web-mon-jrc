import { memo, useCallback, useState } from "react";

import { FORMATION_TEMPLATES } from "../../../store/monitors/type313s/type313sCarInfoUtil";

import styles from "./FormationSelector.module.css";

import type { Type313sFormation } from "../../../store/monitors/type313s/type313sTypes";

type Props = Readonly<{
	isOpen: boolean;
	currentCarCount: number;
	onSelect: (formation: Type313sFormation) => void;
	onClose: () => void;
}>;

export default memo(function FormationSelector({
	isOpen,
	currentCarCount,
	onSelect,
	onClose,
}: Props) {
	const [series, setSeries] = useState<313 | 315>(313);

	const handleSelect = useCallback(
		(template: (typeof FORMATION_TEMPLATES)[number]) => {
			onSelect(template.creator());
			onClose();
		},
		[onSelect, onClose],
	);

	const filteredTemplates = FORMATION_TEMPLATES.filter(
		(template) => template.series === series,
	);

	if (!isOpen) {
		return null;
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<header className={styles.header}>
					<h2>編成テンプレートを選択</h2>
					<button
						type="button"
						onClick={onClose}
						className={styles.closeButton}
						aria-label="Close"
					>
						×
					</button>
				</header>

				<div className={styles.info}>
					現在の車両数: <strong>{currentCarCount}</strong> 両 / 12両
				</div>

				<div className={styles.tabs}>
					<button
						type="button"
						className={`${styles.tab} ${series === 313 ? styles.active : ""}`}
						onClick={() => setSeries(313)}
					>
						313系
					</button>
					<button
						type="button"
						className={`${styles.tab} ${series === 315 ? styles.active : ""}`}
						onClick={() => setSeries(315)}
					>
						315系
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.templateGrid}>
						{filteredTemplates.map((template) => {
							const canAdd = currentCarCount + template.carCount <= 12;
							return (
								<button
									key={template.name}
									type="button"
									className={styles.templateButton}
									onClick={() => handleSelect(template)}
									disabled={!canAdd}
									title={
										canAdd
											? undefined
											: `追加すると合計${currentCarCount + template.carCount}両となり、上限を超えます`
									}
								>
									{template.displayName}
									<span className={styles.carCount}>
										({template.carCount}両)
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
});
