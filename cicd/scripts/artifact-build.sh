echo "${0}"
echo "$@"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SOURCE_DIR="${SCRIPT_DIR}/../.."

docker_image_full_name="${1}"

pushd ${SOURCE_DIR}
    docker build -t ${docker_image_full_name} .
popd
