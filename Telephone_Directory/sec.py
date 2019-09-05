from __future__ import print_function
from sys import argv
import re
import sys
import mysql.connector
hostname = 'localhost'
username = 'root'
password = ''
database = 'secure'


def validate_phone(phone):
	x = re.match('^(([\+][0-9]{1,2})?([ ]?[\(][0-9]{1,2}[\)][ ]?)?(([0-9]{1})?[\(][0-9]{1,3}[\)])?([0-9]{3}[-][0-9]{4})?(([0-9]{1,3}[ ])+[0-9]{4})*([0-9]{5,9})?([0-9]{5}[.][0-9]{5})?)$',phone)
	if x:
		return 0;
	else:
		return 1;

def validate_name(name):
	y = re.match('^((([a-zA-Z]+[\']?)?[a-zA-Z]+[\,]?)?[ ]?(([a-zA-Z]+[\']?)?[a-zA-Z]+[-]?[a-zA-Z]*)?[ ]?([a-zA-Z]*[.]?)?)$',name)
	if y:
		return 0;
	else:
		return 1;
	

conn = mysql.connector.connect( host=hostname, user=username, passwd=password, db=database )

if argv[1].lower()== "add":
	if len(argv)<4:
		print("Enter enough arguments specified")
		print("format:\n ADD<PERSON><PHONE>(or)\nDEL<PERSON>(or)DEL<PHONE>(or)LIST")
	else:
		name_check=validate_name(argv[2])
		phone_check=validate_phone(argv[3])
		if name_check == 0 and phone_check == 0:
			current = conn.cursor()
			current.execute( "INSERT INTO phonedb (person,phone) values (%s, %s)",(argv[2],argv[3]))
			current.execute("commit")
			conn.close()
			print("Inserted successfully")
			sys.exit(0)
		else:
			print("Invalid Input",file=sys.stderr)
			sys.exit(1)

elif argv[1].lower() == "del":
	if len(argv)<3:
		print("Enter enough arguments specified")
		print("format: \n ADD <PERSON> <PHONE> (or) \n DEL <PERSON> (or) \n DEL <PHONE> (or) \n LIST")
	else:
		per= argv[2]
		name_check = validate_name(per)
		phone_check = validate_phone(per)
		if validate_name(argv[2]) == 0:
			current = conn.cursor()
			current.execute("""SELECT * FROM phonedb WHERE person = %s""",(argv[2],))
			r = current.fetchone()
			current.execute("""DELETE FROM phonedb WHERE person = %s""" ,(argv[2],))
			current.execute("commit")
			if r is None:
				print ("No records exist",file=sys.stderr)
				sys.exit(1)
			else:
				print("Given record deleted")
				sys.exit(0)
			conn.close()

		elif phone_check == 0:
			current = conn.cursor()
			current.execute("""select * from phonedb WHERE phone = %s""",(argv[2],))
			r = current.fetchone()
			current.execute("""DELETE FROM phonedb WHERE phone = %s""",(argv[2],))
			current.execute("commit")
			if r is None:
				print ("No records found",file=sys.stderr)
				sys.exit(1)
			else:
				print("Record deleted")
				sys.exit(0)
			conn.close()  
elif argv[1].lower() == "list":
	if len(argv)<2:
		print("Make sure there are enough arguments specified")
		print("format should be : \n ADD <PERSON> <PHONE> (or) \n DEL <PERSON> (or) \n DEL <PHONE> (or) \n LIST")
	else:
		print("Jeet's phone book:")
		current = conn.cursor()
		current.execute( "SELECT * FROM phonedb" )
		for person, phone in current.fetchall() :
			print (person, phone)
		conn.close() 
conn.close()
exit() 