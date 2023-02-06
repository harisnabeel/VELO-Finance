pragma solidity 0.8.13;
import "contracts/interfaces/IBribeStruct.sol";

interface IGaugeFactory {


    function createGauge(
        address,
        IBribeStruct.Bribes memory,
        address,
        bool,
        address[] memory,
        bool
    ) external returns (address);
}
