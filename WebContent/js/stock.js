// get id
var id = parseInt($.url().param('id'));
$("input[name=id]").val(id);

// read item data
var sql = 'SELECT item.id, whouse.name, item.code, item.maker, item.detail, item.price, stock.balance \
	FROM stock \
	JOIN whouse ON whouse.id = stock.whouse \
	JOIN item ON item.id = stock.item \
	JOIN kind ON kind.id = item.kind \
	WHERE stock.id = ?';
var row = alasql(sql, [ id ])[0];
$('#image').attr('src', 'img/' + row.id + '.jpg');
$('#whouse').text(row.name);
$('#code').text(row.code);
$('#maker').text(row.maker);
$('#detail').text(row.detail);
$('#price').text(numberWithCommas(row.price));
var balance = row.balance; // will be used later
$('#balance').text(balance);

// read transaction
var rows = alasql('SELECT * FROM trans WHERE stock = ?', [ id ]);
var tbody = $('#tbody-transs');
for (var i = 0; i < rows.length; i++) {
	var row = rows[i];
	var tr = $('<tr>').appendTo(tbody);
	tr.append('<td>' + row.date + '</td>');
	tr.append('<td>' + row.qty + '</td>');
	tr.append('<td>' + row.balance + '</td>');
	tr.append('<td>' + row.memo + '</td>');
}

// storage/retrieval
$('#update').on('click', function() {
	var date = $('input[name="date"]').val();
	var qty = parseInt($('input[name="qty"]').val());
	var memo = $('textarea[name="memo"]').val();
	alasql('UPDATE stock SET balance = ? WHERE id = ?', [ balance + qty, id ]);
	var trans_id = alasql('SELECT MAX(id) + 1 as id FROM trans')[0].id;
	alasql('INSERT INTO trans VALUES(?,?,?,?,?,?)', [ trans_id, id, date, qty, balance + qty, memo ]);
	window.location.assign('stock.html?id=' + id);
});
