define(["utils"], function(utils) {
    return { import_and_check: import_and_check,
	     text_for_data: text_for_data,
	     float_for_data: float_for_data,
	     reverse_flux_for_data: reverse_flux_for_data,
	     csv_converter: csv_converter
	   };

    function import_and_check(data, styles, name) {
	if (data===null) return null;
	// make array
	if (!(data instanceof Array)) {
	    data = [data];
	}
	// check data
	var check = function() {
	    if (data===null)
		return null;
	    if (data.length==1)
		return null;
	    if (data.length==2) // && styles.indexOf('Diff')!=-1
		return null;
	    return console.warn('Bad data style: '+name);
	};
	check();
	data = utils.array_to_object(data);
	return data;
    }

    function float_for_data(d, styles, ignore_abs) {
	if (ignore_abs===undefined) ignore_abs = false;
	if (d===null) return null;
	var f = null;
	if (d.length==1) f = d[0];
	if (d.length==2) { // && styles.indexOf('Diff')!=-1) {
	    if (d[0]===null || d[1]===null) return null;
	    else f = d[1] - d[0];
	}
	if (styles.indexOf('abs')!=-1 && !ignore_abs) {
	    f = Math.abs(f);
	}
	return f;
    }

    function reverse_flux_for_data(d, styles) {
	if (d===null) return null;
	if (d.length==1)
	    return (d[0] <= 0);
	if (d.length==2) // && styles.indexOf('Diff')!=-1)
	    return ((d[1] - d[0]) <= 0);
	return true;
    }

    function text_for_data(d, styles) {
	if (d===null)
	    return null_or_d(null);
	var f = float_for_data(d, styles, true);
	if (d.length==1) {
	    var format = d3.format('.4g');
	    return null_or_d(f, format);
	}
	if (d.length==2) { // && styles.indexOf('Diff')!=-1) {
	    var format = d3.format('.3g'),
		t = null_or_d(d[0], format);
	    t += ', ' + null_or_d(d[1], format);
	    t += ': ' + null_or_d(f, format);
	    return t;
	}
	return '';

	// definitions
	function null_or_d(d, format) {
	    return d===null ? '(nd)' : format(d);
	}
    }

    function csv_converter(csv_rows) {
	/** Convert data from a csv file to json-style data.

	 */
	converted = {};
	csv_rows.forEach(function(row) {
	    if (row.length==2)
		converted[row[0]] = parseFloat(row[1]);
	    else if (row.length > 2)
		converted[row[0]] = row.slice(1).map(parseFloat);
	    else
		throw new Error('CSV file must have at least 2 columns');
	});
	return converted;
    }
});
