import { memo } from "react";

import styles from "../Type313sEditPage.module.css";

import CarCompositionDiagram from "./CarCompositionDiagram";

import type { Type313sFormation } from "../../../store/monitors/type313s/type313sTypes";

type FormationCompositionViewProps = {
	readonly formations: Type313sFormation[];
	readonly onCompositionItemClick: (carIndex: number) => void;
};

export default memo<FormationCompositionViewProps>(
	function FormationCompositionView({ formations, onCompositionItemClick }) {
		console.log(
			"[FormationCompositionView] rendered with formations:",
			formations?.length,
			"onCompositionItemClick:",
			typeof onCompositionItemClick,
		);
		if (!formations || !Array.isArray(formations)) {
			console.error(
				"[FormationCompositionView] formations is not an array:",
				formations,
			);
			return <div>エラー: formations が見つかりません</div>;
		}
		console.log(
			"[FormationCompositionView] formations.length:",
			formations.length,
		);
		// Calculate global car index for each car across all formations
		const getGlobalCarIndex = (
			targetFormationIndex: number,
			targetCarIndex: number,
		): number => {
			let globalIndex = 0;
			for (let fi = 0; fi < formations.length; fi++) {
				if (fi === targetFormationIndex) {
					globalIndex += targetCarIndex;
					break;
				}
				globalIndex += formations[fi].carInfoList.length;
			}
			return globalIndex;
		};

		return (
			<div className={styles.carCompositionSection}>
				<h3 className={styles.carCompositionTitle}>編成構成</h3>
				<div className={styles.carCompositionList}>
					{formations.map((formation, formationIndex) => (
						<div
							// eslint-disable-next-line react/no-array-index-key
							key={`composition-section-${formationIndex}`}
							className={styles.formationCompositionGroup}
						>
							<div className={styles.formationCompositionLabel}>
								編成 {formationIndex + 1}
							</div>
							<div className={styles.carCompositionListInline}>
								{formation.carInfoList.map((carState, carIndex) => {
									const globalCarIndex = getGlobalCarIndex(
										formationIndex,
										carIndex,
									);
									return (
										<div
											// eslint-disable-next-line react/no-array-index-key
											key={`composition-${formationIndex}-${carIndex}`}
											className={styles.carCompositionItem}
											onClick={() => {
												console.log(
													"[carCompositionItem] clicked, globalCarIndex:",
													globalCarIndex,
												);
												onCompositionItemClick(globalCarIndex);
											}}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													onCompositionItemClick(globalCarIndex);
												}
											}}
											style={{ cursor: "pointer" }}
										>
											<CarCompositionDiagram carState={carState} />
											<div className={styles.carInfo}>
												<div className={styles.carId}>{carState.carNumber}</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	},
);
