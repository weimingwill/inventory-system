// options: warehouses and items
var rows = alasql('SELECT * FROM whouse;');
for (var i = 0; i < rows.length; i++) {
	var row = rows[i];
	var option = $('<option>');
	option.attr('value', row.id);
	option.text(row.name);
	$('select[name="whouse"]').append(option);
}

var rows = alasql('SELECT * FROM item;');
for (var i = 0; i < rows.length; i++) {
	var row = rows[i];
	var option = $('<option>');
	option.attr('value', row.id);
	option.text('[' + row.code + '] ' + row.detail);
	$('select[name="item"]').append(option);
}

// update database
$('#update').on('click', function() {
	var whouse = parseInt($('select[name="whouse"]').val());
	var item = parseInt($('select[name="item"]').val());
	var date = $('input[name="date"]').val();
	var qty = parseInt($('input[name="qty"]').val());
	var memo = $('textarea[name="memo"]').val();

	// update stock record
	var rows = alasql('SELECT id, balance FROM stock WHERE whouse = ? AND item = ?', [ whouse, item ]);
	var stock_id, balance = 0;
	if (rows.length > 0) {
		stock_id = rows[0].id;
		balance = rows[0].balance;
		alasql('UPDATE stock SET balance = ? WHERE id = ?', [ balance + qty, stock_id ]);
	} else {
		stock_id = alasql('SELECT MAX(id) + 1 as id FROM stock')[0].id;
		alasql('INSERT INTO stock VALUES(?,?,?,?)', [ stock_id, item, whouse, balance + qty ]);
	}
	// add trans record
	var trans_id = alasql('SELECT MAX(id) + 1 as id FROM trans')[0].id;
	alasql('INSERT INTO trans VALUES(?,?,?,?,?,?)', [ trans_id, stock_id, date, qty, balance + qty, memo ]);
	// reload page
	window.location.assign('stock.html?id=' + stock_id);
});
