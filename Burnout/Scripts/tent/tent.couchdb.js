tent.declare("tent.connectors.couchdb",function(){tent.connectors.couchdb.CouchDBConnector=function(){var c=new tent.connectors.rest.RestConnector;c.couchdb=true;c.provider="CouchDB";c.options.saveChanges.bulk=true;c.options.saveChanges.bulkUrl="_bulk_docs";c.options.saveChanges.useCollectionInUrl=false;c.options.saveChanges.revisionProperty="_rev";c.filters.load.unshift(function(a){if(typeof a.data.rows=="object"&&a.data.rows instanceof Array&&typeof a.data.total_rows=="number"){a.data.items=[];
for(var b=0,e=a.data.rows.length;b<e;b++)a.data.items.push(a.data.rows[b].doc);delete a.data.rows}else a.data={total_rows:1,items:[a.data]};return a});c.filters.saveChanges.push(function(a){if(a.data&&a.data.items instanceof Array){for(var b=0,e=a.data.items.length;b<e;b++){var d=a.data.items[b];if(a.packedChanges&&a.packedChanges[b]&&a.packedChanges[b].__changeState__===tent.entities.ChangeStates.DELETED)d._deleted=true}a.data.docs=a.data.items;delete a.data.items}else if(a.packedChanges&&a.packedChanges.length===
1)if(a.options.http.type==="DELETE"){if(!a.options.http.headers)a.options.http.headers={};a.packedChanges[0]._deleted=true;a.options.http.headers["If-Match"]=a.packedChanges[0][a.options.saveChanges.revisionProperty];a.options.http.url+="?rev="+a.packedChanges[0][a.options.saveChanges.revisionProperty]}return a});c.filters.saveResult.unshift(function(a){for(var b=0,e=a.data.items.length;b<e;b++){var d=a.data.items[b];delete d.ok;d._id=d.id;delete d.id;d._rev=d.rev;delete d.rev;if(!d.error&&a.packedChanges&&
a.packedChanges[b]&&a.packedChanges[b].__changeState__===tent.entities.ChangeStates.DELETED)d._deleted=true}return a});c.filters.saveResult.unshift(function(a){a.data=typeof a.data=="object"&&a.data instanceof Array?{items:a.data}:{items:[a.data]};return a});return c}});