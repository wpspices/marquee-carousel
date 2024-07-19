//check if empty
export const mcEmpty = ( data ) => 'undefined' === typeof data || null === data || '' === data;

export const mcUcaseFirst = ( str ) => str && str[0].toUpperCase() + str.slice(1);

/**
 * Generate Unique ID
 *
 * @param { string } prefix prefix of id
 * @param { array } dataStore store of ids to check uniqueness
 * @returns { string } unique ID
 */
export const mcGenerateUniqueId = ( prefix = 'mc' ) => {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let uniqueId = Date.now().toString( 36 ); // Convert the current timestamp to a base-36 string
	for ( let i = 0; i < 8; i++ ) {
		// Add 8 random characters instead of 6
		uniqueId += chars.charAt( Math.floor( Math.random() * chars.length ) );
	}
	uniqueId = prefix + '_' + uniqueId.substring( 0, 15 ); // Ensure the final length is 15 characters
	return uniqueId.toLowerCase();
};