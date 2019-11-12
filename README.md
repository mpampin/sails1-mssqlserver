# Sails 1.0 MS-SQL Server Adapter

MS SQL Server adapter for the Sails 1.0 framework and Waterline ORM.  Allows you to use MS SQL via your models to store and retrieve data.  Also provides a `query()` method for a direct interface to execute raw SQL commands.

NOTE: I'm currently working on this adapter, it's possible that some things won't work.


## Installation

Install from NPM.

```bash
# In your app:
$ npm install sails1-mssqlserver
```

## Help

If you have further questions or are having trouble, click [here](http://sailsjs.com/support).


## Bugs &nbsp; [![NPM version](http://npmjs.com/package/sails1-mssqlserver)

To report a bug, email me at mauro.pampin@gmail.com 


## Contributing

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](http://sailsjs.com/documentation/contributing) when opening issues or submitting pull requests.

[![NPM](https://nodei.co/npm/sails1-mssqlserver.png?downloads=true)](http://npmjs.com/package/sails1-mssqlserver)


#### Running the tests

To run the tests, point this adapter at your database by specifying a [connection URL](http://sailsjs.com/documentation/reference/configuration/sails-config-datastores#?the-connection-url) and run `npm test`:

```
WATERLINE_ADAPTER_TESTS_URL=mysql://root:myc00lP4ssw0rD@localhost/adapter_tests npm test
```

> For more info, see [**Reference > Configuration > sails.config.datastores > The connection URL**](http://sailsjs.com/documentation/reference/configuration/sails-config-datastores#?the-connection-url), or [ask for help](http://sailsjs.com/support).

## License

This adapter, like the [Sails framework](http://sailsjs.com) is free and open-source under the [MIT License](http://sailsjs.com/license).

