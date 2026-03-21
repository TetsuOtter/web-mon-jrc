import { memo, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	setFormations,
	resetState,
} from "../../store/monitors/type313s/type313sSlice";

import styles from "./Type313sEditPage.module.css";
import ConductorStateSection from "./components/ConductorStateSection";
import FormationCard from "./components/FormationCard";
import FormationCompositionView from "./components/FormationCompositionView";
import FormationSelector from "./components/FormationSelector";
import TrainInfoSection from "./components/TrainInfoSection";
import { createDefaultCarState } from "./fieldDefinitions";

import type {
	Type313sCarInfoState,
	Type313sFormation,
} from "../../store/monitors/type313s/type313sTypes";

export default memo(function Type313sEditPage() {
	const dispatch = useAppDispatch();
	const [isSelectorOpen, setIsSelectorOpen] = useState(false);
	const carDetailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);
	const carListContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
	const formationsContainerRef = useRef<HTMLDivElement | null>(null);
	const formations = useAppSelector(
		(state) => state.monitors.type313s.formations,
	);

	const updateCarState = useCallback(
		(
			formationIndex: number,
			carIndex: number,
			updater: (car: Type313sCarInfoState) => Type313sCarInfoState,
		) => {
			dispatch(
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: f.carInfoList.map((carState, ci) =>
										ci === carIndex ? updater(carState) : carState,
									),
								}
							: f,
					),
				),
			);
		},
		[formations, dispatch],
	);

	const handleAddFormation = useCallback(() => {
		// 編成数の上限チェック
		if (formations.length >= 6) {
			return;
		}

		// 全編成の車両数合計を計算（最小1両の編成を追加することを想定）
		const totalCars = formations.reduce(
			(sum, f) => sum + f.carInfoList.length,
			0,
		);

		// すでに12両に達していれば追加できない
		if (totalCars >= 12) {
			return;
		}

		setIsSelectorOpen(true);
	}, [formations]);

	const handleFormationSelect = useCallback(
		(formation: Type313sFormation) => {
			if (formations.length >= 6) {
				return;
			}

			// 全編成の車両数合計を計算
			const totalCars = formations.reduce(
				(sum, f) => sum + f.carInfoList.length,
				0,
			);

			// 新しい編成の車両数を含めて、全体で12両に達していれば追加できない
			if (totalCars + formation.carInfoList.length > 12) {
				return;
			}

			dispatch(setFormations([...formations, formation]));
		},
		[formations, dispatch],
	);

	const handleRemoveFormation = useCallback(
		(formationIndex: number) => {
			if (formations.length <= 1) {
				return;
			}
			dispatch(
				setFormations(formations.filter((_, fi) => fi !== formationIndex)),
			);
		},
		[formations, dispatch],
	);

	const handleAddCar = useCallback(
		(formationIndex: number) => {
			const formation = formations[formationIndex];
			if (!formation) {
				return;
			}

			// 全編成の車両数合計を計算
			const totalCars = formations.reduce(
				(sum, f) => sum + f.carInfoList.length,
				0,
			);

			// 全体で12両に達していれば追加できない
			if (totalCars >= 12) {
				return;
			}

			dispatch(
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: [...f.carInfoList, createDefaultCarState()],
								}
							: f,
					),
				),
			);
		},
		[formations, dispatch],
	);

	const handleRemoveCar = useCallback(
		(formationIndex: number, carIndex: number) => {
			const formation = formations[formationIndex];
			if (!formation || formation.carInfoList.length <= 1) {
				return;
			}
			dispatch(
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: f.carInfoList.filter((_, ci) => ci !== carIndex),
								}
							: f,
					),
				),
			);
		},
		[formations, dispatch],
	);

	const handleResetState = useCallback(() => {
		if (window.confirm("本当にデータをリセットしてもよろしいですか?")) {
			dispatch(resetState());
		}
	}, [dispatch]);

	const handleCompositionItemClick = useCallback(
		(globalCarIndex: number) => {
			const formationsContainer = formationsContainerRef.current;
			const element = carDetailsRefs.current[globalCarIndex];
			if (!element || !formationsContainer) {
				return;
			}

			let currentIndex = 0;
			let targetFormationIndex = 0;
			for (let i = 0; i < formations.length; i++) {
				const carCountInFormation = formations[i].carInfoList.length;
				if (currentIndex + carCountInFormation > globalCarIndex) {
					targetFormationIndex = i;
					break;
				}
				currentIndex += carCountInFormation;
			}

			const carListContainer =
				carListContainerRefs.current[targetFormationIndex];
			if (!carListContainer) return;

			const formationCard = carListContainer.parentElement;
			if (!formationCard) return;

			let elementLeftInContainer = 0;
			let currentEl: HTMLElement | null = element;

			while (currentEl && currentEl !== formationsContainer) {
				elementLeftInContainer += currentEl.offsetLeft;
				currentEl = currentEl.offsetParent as HTMLElement | null;
				if (currentEl === formationsContainer) break;
			}

			const elementWidth = element.offsetWidth;
			const elementRightInContainer = elementLeftInContainer + elementWidth;
			const containerWidth = formationsContainer.clientWidth;

			let offsetLeft: number;
			if (elementLeftInContainer - formationsContainer.scrollLeft < 20) {
				if (elementLeftInContainer < 100) {
					offsetLeft = 0;
				} else {
					offsetLeft = Math.max(0, elementLeftInContainer - 20);
				}
			} else if (
				elementRightInContainer - formationsContainer.scrollLeft >
				containerWidth - 20
			) {
				offsetLeft = Math.max(0, elementRightInContainer - containerWidth + 20);
			} else {
				offsetLeft = formationsContainer.scrollLeft;
			}
			formationsContainer.scrollLeft = offsetLeft;

			setTimeout(() => {
				const elementWidth = element.offsetWidth;
				const containerWidth2 = carListContainer.clientWidth;

				let elementLeftInCarListContainer = 0;
				let currentEl2: HTMLElement | null = element;

				while (currentEl2 && currentEl2 !== carListContainer) {
					elementLeftInCarListContainer += currentEl2.offsetLeft;
					currentEl2 = currentEl2.offsetParent as HTMLElement | null;
					if (currentEl2 === carListContainer) break;
				}

				const elementRightInCarListContainer =
					elementLeftInCarListContainer + elementWidth;

				let offsetLeft2: number;
				if (elementLeftInCarListContainer - carListContainer.scrollLeft < 20) {
					offsetLeft2 = Math.max(0, elementLeftInCarListContainer - 20);
				} else if (
					elementRightInCarListContainer - carListContainer.scrollLeft >
					containerWidth2 - 20
				) {
					offsetLeft2 = Math.max(
						0,
						elementRightInCarListContainer - containerWidth2 + 20,
					);
				} else {
					offsetLeft2 = carListContainer.scrollLeft;
				}
				carListContainer.scrollLeft = offsetLeft2;
			}, 100);
		},
		[formations],
	);

	return (
		<div className={styles.container}>
			<FormationSelector
				isOpen={isSelectorOpen}
				currentCarCount={formations.reduce(
					(sum, f) => sum + f.carInfoList.length,
					0,
				)}
				onSelect={handleFormationSelect}
				onClose={() => setIsSelectorOpen(false)}
			/>

			<header className={styles.header}>
				<h1>313系 モニター設定</h1>
				<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
					<button
						type="button"
						onClick={handleResetState}
						className={styles.deleteButton}
						style={{ marginRight: "auto" }}
					>
						↻ リセット
					</button>
					<Link
						to="/"
						className={styles.homeLink}
					>
						← トップへ戻る
					</Link>
				</div>
			</header>

			<main className={styles.main}>
				<TrainInfoSection />

				<ConductorStateSection />

				<section className={styles.section}>
					<details
						open
						className={styles.collapseSection}
					>
						<summary className={styles.sectionSummaryWithAction}>
							<span>編成・車両状態</span>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleAddFormation();
								}}
								disabled={
									formations.length >= 6 ||
									formations.reduce(
										(sum, f) => sum + f.carInfoList.length,
										0,
									) >= 12
								}
								className={styles.actionButton}
							>
								+ 編成追加
							</button>
						</summary>

						<FormationCompositionView
							formations={formations}
							onCompositionItemClick={handleCompositionItemClick}
						/>

						<div
							className={styles.formationsContainer}
							ref={formationsContainerRef}
						>
							{formations.map((formation, formationIndex) => (
								<FormationCard
									// eslint-disable-next-line react/no-array-index-key
									key={`formation-${formationIndex}`}
									formationIndex={formationIndex}
									formation={formation}
									formations={formations}
									onAddCar={handleAddCar}
									onRemoveFormation={handleRemoveFormation}
									onRemoveCar={handleRemoveCar}
									onUpdateCarState={updateCarState}
									carDetailsRefs={carDetailsRefs}
									carListContainerRefs={carListContainerRefs}
								/>
							))}
						</div>
					</details>
				</section>

				<section className={styles.section}>
					<h2>備考</h2>
					<p className={styles.note}>
						この画面で変更した内容は、LocalStorage に自動保存されます。
						<br />
						別のタブを開いている場合は、そちらにも即座に反映されます。
					</p>
				</section>
			</main>
		</div>
	);
});
