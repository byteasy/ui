. /etc/profile
VERSION=1.0.0
APP_NAME=cloud-platform-common-ui
echo UI name: $APP_NAME-$VERSION
pnpm install
pnpm approve-builds
pnpm run build-only
jar cvf $APP_NAME-$VERSION.jar -C dist .
mvn install:install-file -DgroupId=com.byteasy -DartifactId=$APP_NAME -Dversion=$VERSION -Dpackaging=jar -Dfile=$APP_NAME-$VERSION.jar
rm -f $APP_NAME-$VERSION.jar
