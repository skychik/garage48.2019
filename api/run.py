#!/usr/bin/python
#coding=utf8
from app import app

from sets import SERVER


if __name__ == '__main__':
	app.run(
		host=SERVER['ip'],
		port=SERVER['port'],
		debug=True,
		threaded=True,
	)
