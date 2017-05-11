import csv
import random


def generate_random_numbers_add_up_to_sum(n, total):
    """Return a randomly chosen list of n positive integers summing to total.
    Each such list is equally likely to occur."""

    dividers = sorted(random.sample(xrange(1, total), n - 1))
    return [a - b for a, b in zip(dividers + [total], [0] + dividers)]


def generate_sales_by_ten_days():
    time = '2014-5-0'
    with open('sales.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

        for row in spamreader:
            if row[0] != 'time':
                parts = time.split('-')
                year = int(parts[0])
                month = int(parts[1])
                day = int(parts[2])

                if month == 12 and day == 3:
                    year += 1
                    month = 1
                    day = 1
                elif day == 3:
                    month += 1
                    day = 1
                else:
                    day += 1

                time = '-'.join([str(year), str(month), str(day)])

                sales = int(row[1]) + 500

                print ','.join([time, str(sales)])
            else:
                print ','.join(row)


def generate_sales_by_month():
    """
    Use data in form
    :return:
    """
    with open('sales.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

        counter = 0
        trend = 0
        for row in spamreader:
            time = row[0]
            if time != 'time':
                if counter == 12:
                    trend += 0
                    counter = 0
                else:
                    counter += 1
                sales = int(row[1]) + trend

                print ','.join([time, str(sales)])
            else:
                print ','.join(row)


def generate_sales_by_month2():
    '''
    Generate data from scratch
    :return:
    '''
    # ids = [1, 3, 4, 5, 6, 7, 8]
    # ids = [9, 10, 11, 12, 13, 14]
    ids = [15, 16, 17, 18, 19, 20, 21, 22]
    is_summer_wear = False
    for variantId in ids:
        with open('sales-template.csv', 'rb') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

            sales = 800
            counter = 0
            trend = 0
            for row in spamreader:
                time = row[0]
                if time != 'time':
                    if (counter >= 7 and is_summer_wear) or (counter < 7 and not is_summer_wear):
                        sales -= random.randint(10, 20)
                    else:
                        sales += random.randint(10, 20)

                    if counter == 12:
                        trend += 0
                        counter = 0
                    else:
                        counter += 1

                    print ','.join([time, str(sales), str(variantId)])
                # else:
                #     print ','.join(row)


generate_sales_by_month2()


def generate_sales_order():
    with open('sales.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

        for row in spamreader:
            time = row[0]
            if time != 'time':
                day = 1
                sales = int(row[1])
                sales_per_day = generate_random_numbers_add_up_to_sum(30, sales)
                for sale in sales_per_day:
                    date = time + "-" + str(day)
                    print ','.join([date, str(sale)])
                    day += 1
            else:
                print ','.join(row)







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