ARCHIVES_DIR=/home/yang/project/byteasy-release-archives
VERSION=1.1.0
jar cvf tuna-byteasy-ui-$VERSION.jar -C dist .
mvn install:install-file -DgroupId=com.tuna.byteasy -DartifactId=tuna-byteasy-ui -Dversion=$VERSION -Dpackaging=jar -Dfile=tuna-byteasy-ui-$VERSION.jar
if [ -d "$ARCHIVES_DIR/plugin" ] ; then
  echo "$ARCHIVES_DIR/plugin exist, do nothing"
else
  mkdir $ARCHIVES_DIR/plugin
  echo "mkdir $ARCHIVES_DIR/plugin"
fi
cp tuna-byteasy-ui-$VERSION.jar $ARCHIVES_DIR/plugin
echo "cp tuna-byteasy-ui-$VERSION.jar $ARCHIVES_DIR/plugin"
rm tuna-byteasy-ui-$VERSION.jar
echo "rm tuna-byteasy-ui-$VERSION.jar"
