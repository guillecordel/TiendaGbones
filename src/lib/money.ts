/**
 * Money formatting utilities for Gbones
 * All prices are displayed at half the stored value in EUR
 */

/**
 * Halve the price (for display only, no data mutation)
 * @param cents - Original price in cents
 * @returns Halved price in cents, rounded
 */
export function halfCents(cents: number): number {
	return Math.round(cents / 2);
}

/**
 * Format price in EUR with halved value
 * This is the main formatter to use throughout the app
 * @param cents - Original price in cents (will be halved for display)
 * @returns Formatted price string in EUR (e.g., "14,99 €")
 */
export function formatMoneyEUR(cents: number): string {
	const halved = halfCents(cents);
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(halved / 100);
}

/**
 * Format price in EUR WITHOUT halving (use for already-halved amounts)
 * @param cents - Price in cents (already halved)
 * @returns Formatted price string in EUR
 */
export function formatEURDirect(cents: number): string {
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(cents / 100);
}
