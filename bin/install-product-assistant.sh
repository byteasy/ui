VERSION=1.0.0
APP_NAME=product-assistant-ui
echo UI name: $APP_NAME-$VERSION
cd ..
pnpm run build-only
jar cvf $APP_NAME-$VERSION.jar -C dist .
mvn install:install-file -DgroupId=com.tuna -DartifactId=$APP_NAME -Dversion=$VERSION -Dpackaging=jar -Dfile=$APP_NAME-$VERSION.jar
rm -f $APP_NAME-$VERSION.jar
