def generate_layers():
    firstline = 'id,warehouseId,shelfId,name,fullname\n'
    id = 1
    warehouse_id = "1"
    shelf_ids = [x for x in range(1, 79)]

    file_content = ""
    file_content += firstline

    for shelfId in shelf_ids:
        for i in range(1, 6):
            name = 'L' + str(i)
            fullname = 'Level ' + str(i)
            line = ','.join([str(id), warehouse_id, str(shelfId), name, fullname])
            line += '\n'
            file_content += line
            id += 1

    print file_content
    return file_content


def generate_cells():
    firstline = 'id,layerId,name\n'
    id = 1
    warehouse_id = "1"
    shelf_ids = [x for x in range(1, 79)]
    layer_ids = [x for x in range(1, 391)]

    file_content = ""
    file_content += firstline

    for layer_id in layer_ids:
        for i in range(1, 6):
            name = 'Cell ' + str(i)
            line = ','.join([str(id), str(layer_id), name])
            line += '\n'
            file_content += line
            id += 1

    print file_content


def generate_cell_variant_join_table():
    firstline = 'cellId,variantId,quantity\n'
    cell_ids = [x for x in range(1, 100)]
    quantity = 5
    variant_ids1 = [x for x in range(1, 9)]
    variant_ids2 = [x for x in range(9, 15)]
    variant_ids3 = [x for x in range(15, 23)]

    file_content = ''
    file_content += firstline
    cell_id = 1

    while cell_id < 100:
        for variant_ids in [variant_ids1, variant_ids2, variant_ids3]:
            for variant_id in variant_ids:
                line = ','.join([str(cell_id), str(variant_id), str(quantity)])
                line += '\n'
                file_content += line
                cell_id += 1

    print file_content
    return file_content

generate_cell_variant_join_table()
